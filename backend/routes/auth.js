const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Fix the User import - use require with the correct path
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/email');
const { makeFingerprintFromReq, getIpFromReq } = require('../utils/anomalyDetector');
const anomalyDetector = require('../middleware/anomalyDetector');

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Helper function to check MongoDB connection
const checkMongoConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      status: 'fail', 
      message: 'Database not available. Please try again later.' 
    });
  }
  return null;
};

// ---------- SIGNUP ----------
router.post('/signup', async (req, res) => {
  try {
    const connectionError = checkMongoConnection(res);
    if (connectionError) return connectionError;

    const { email, password, name, company } = req.body;
    
    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Valid email address is required' 
      });
    }
    
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ status: 'fail', message: 'Email already registered' });
    }

    const user = await User.create({ 
      email: email.toLowerCase().trim(),
      password, 
      name, 
      company 
    });
    
    console.log('New user created:', {
      id: user._id,
      email: user.email,
      name: user.name
    });
    
    user.password = undefined;
    
    // Sign token for immediate login after signup
    const token = signToken(user._id);
    res.status(201).json({ status: 'success', data: { user, token }});
  } catch (err) {
    console.error('Signup error:', err);
    
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res.status(409).json({ status: 'fail', message: 'Email already registered' });
    }
    
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// ---------- LOGIN (with anomaly detection + OTP challenge) ----------
router.post('/login', async (req, res, next) => {
  try {
    const connectionError = checkMongoConnection(res);
    if (connectionError) return connectionError;

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'fail', message: 'Email and password required' });

    // FIRST: Find user by email to get the ID
    const userByEmail = await User.findOne({ email: email.toLowerCase().trim() })
      .select('_id password');
    
    if (!userByEmail) return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });

    const correct = await userByEmail.correctPassword(password, userByEmail.password);
    if (!correct) return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });

    // SECOND: Now get the complete user data with all fields
    const completeUser = await User.findById(userByEmail._id)
      .select('+password +otpHash +otpExpires +email +name trustedDevices loginHistory company');
    
    if (!completeUser) return res.status(401).json({ status: 'fail', message: 'User not found' });

    // Debug: Check what fields are available
    console.log('Complete user found:', {
      id: completeUser._id,
      email: completeUser.email,
      name: completeUser.name,
      hasEmail: !!completeUser.email,
      hasName: !!completeUser.name,
      allFields: Object.keys(completeUser.toObject ? completeUser.toObject() : {})
    });

    // Attach complete user to request for middleware
    req.user = completeUser;
    
    // Call next to proceed to anomaly detection middleware
    next();
  } catch (err) {
    console.error('Login error', err);
    
    if (err.name === 'MongoServerError') {
      return res.status(503).json({ status: 'fail', message: 'Database error. Please try again.' });
    }
    
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
}, anomalyDetector, async (req, res) => {
  // This is the final handler after anomaly detection
  try {
    const connectionError = checkMongoConnection(res);
    if (connectionError) return connectionError;

    const user = req.user;
    
    // Debug: Check user object in final handler
    console.log('User in final handler:', {
      id: user._id,
      email: user.email,
      name: user.name,
      hasEmail: !!user.email,
      hasName: !!user.name
    });

    // Check if anomaly detection middleware set a challenge requirement
    if (res.anomalyChallengeRequired) {
      // Anomalous: create OTP, email it, save otpHash + expiry to user
      const otpLength = Number(process.env.OTP_LENGTH || 6);
      const otp = (Math.floor(Math.random() * Math.pow(10, otpLength))).toString().padStart(otpLength, '0');

      const otpHash = await bcrypt.hash(otp, 12);
      const expires = Date.now() + (Number(process.env.OTP_EXPIRES_MINUTES || 30) * 60 * 1000);

      // Update user with OTP data
      await User.findByIdAndUpdate(user._id, {
        otpHash,
        otpExpires: new Date(expires),
        hasPendingAnomaly: true,
        $push: {
          loginHistory: {
            ip: getIpFromReq(req),
            country: (require('geoip-lite').lookup(getIpFromReq(req)) || {}).country || '',
            city: (require('geoip-lite').lookup(getIpFromReq(req)) || {}).city || '',
            device: req.headers['user-agent'] || '',
            time: new Date(),
            status: 'challenged',
            riskScore: req.riskScore
          }
        }
      });

      // Get fresh user data to ensure we have email
      const freshUser = await User.findById(user._id);
      
      // Debug logging
      console.log('Fresh user data for OTP:', {
        userId: freshUser._id,
        email: freshUser.email,
        name: freshUser.name
      });

      // Check if email is valid before attempting to send
      if (!freshUser.email || typeof freshUser.email !== 'string' || !freshUser.email.includes('@')) {
        console.error('Invalid user email, cannot send OTP:', freshUser.email);
        
        // Return OTP in response for development
        return res.status(200).json({
          status: 'challenge',
          message: 'Suspicious login detected. Use the OTP below for verification.',
          userId: freshUser._id,
          riskScore: req.riskScore,
          expiresInMinutes: Number(process.env.OTP_EXPIRES_MINUTES || 30),
          developmentOtp: otp,
          emailError: 'Invalid email address in user record'
        });
      }

      try {
        // Try to send email
        await sendOtpEmail(freshUser.email, otp, freshUser.name);
        console.log(`OTP sent successfully to ${freshUser.email}`);
        
        return res.status(200).json({
          status: 'challenge',
          message: 'Suspicious login detected. An OTP has been sent to your registered email.',
          userId: freshUser._id,
          riskScore: req.riskScore,
          expiresInMinutes: Number(process.env.OTP_EXPIRES_MINUTES || 30)
        });
      } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
        
        // For development, return OTP in response
        return res.status(200).json({
          status: 'challenge',
          message: 'Suspicious login detected. Use the OTP below for verification.',
          userId: freshUser._id,
          riskScore: req.riskScore,
          expiresInMinutes: Number(process.env.OTP_EXPIRES_MINUTES || 30),
          developmentOtp: otp,
          emailError: emailError.message
        });
      }
    } else {
      // Normal login: update device info and login history
      const fingerprint = makeFingerprintFromReq(req);
      const ip = getIpFromReq(req);
      const geo = ip ? require('geoip-lite').lookup(ip) || {} : {};
      
      // Update user data
      await User.findByIdAndUpdate(user._id, {
        hasPendingAnomaly: false,
        $push: {
          loginHistory: {
            ip: ip,
            country: geo.country || '',
            city: geo.city || '',
            device: req.headers['user-agent'] || '',
            time: new Date(),
            status: 'success',
            riskScore: req.riskScore || 0
          }
        }
      });

      // Get fresh user data for response
      const freshUser = await User.findById(user._id);
      
      const token = signToken(freshUser._id);
      freshUser.password = undefined;
      freshUser.otpHash = undefined;
      freshUser.otpExpires = undefined;
      
      return res.status(200).json({ 
        status: 'success', 
        token, 
        data: { user: freshUser },
        riskScore: req.riskScore || 0
      });
    }
  } catch (err) {
    console.error('Error in login final handler:', err);
    
    if (err.name === 'MongoServerError') {
      return res.status(503).json({ status: 'fail', message: 'Database error. Please try again.' });
    }
    
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
});



// ---------- VERIFY OTP (issue token after success) ----------
router.post('/verify-otp', async (req, res) => {
  try {
    const connectionError = checkMongoConnection(res);
    if (connectionError) return connectionError;

    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ status: 'fail', message: 'userId and otp required' });

    const user = await User.findById(userId).select('+otpHash +otpExpires trustedDevices loginHistory');
    if (!user || !user.otpHash) {
      return res.status(400).json({ status: 'fail', message: 'No OTP pending or invalid user' });
    }

    if (user.otpExpires && user.otpExpires.getTime() < Date.now()) {
      // expired
      user.clearOtp();
      await user.save();
      return res.status(400).json({ status: 'fail', message: 'OTP expired. Please login again.' });
    }

    const valid = await bcrypt.compare(otp, user.otpHash);
    if (!valid) {
      return res.status(401).json({ status: 'fail', message: 'Invalid OTP' });
    }

    // OTP valid: clear otp and mark device as trusted
    const fingerprint = makeFingerprintFromReq(req);
    user.trustedDevices = user.trustedDevices || [];
    const existing = user.trustedDevices.find(d => d.fingerprint === fingerprint);
    if (!existing) {
      user.trustedDevices.push({ 
        fingerprint, 
        label: 'Auto-added after OTP verification', 
        lastSeen: new Date() 
      });
    } else {
      existing.lastSeen = new Date();
    }

    // Update login history to mark as verified
    if (user.loginHistory && user.loginHistory.length > 0) {
      const lastLogin = user.loginHistory[user.loginHistory.length - 1];
      lastLogin.status = 'verified';
    }

    user.clearOtp(); // This also clears hasPendingAnomaly
    await user.save();

    const token = signToken(user._id);
    return res.status(200).json({ 
      status: 'success', 
      token, 
      message: 'OTP verified. Login successful.' 
    });
  } catch (err) {
    console.error('Verify OTP error', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
});

// Add a route to verify tokens and check anomaly status
router.get('/verify', async (req, res) => {
  try {
    const connectionError = checkMongoConnection(res);
    if (connectionError) return connectionError;

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }

    res.status(200).json({ 
      status: 'success', 
      data: { user },
      hasPendingAnomaly: user.hasPendingAnomaly
    });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
});

// Add endpoint to get user risk history
router.get('/risk-history', async (req, res) => {
  try {
    const connectionError = checkMongoConnection(res);
    if (connectionError) return connectionError;

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }

    // Get last 10 login attempts with risk scores
    const riskHistory = user.loginHistory
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10)
      .map(login => ({
        time: login.time,
        riskScore: login.riskScore,
        status: login.status,
        ip: login.ip,
        location: `${login.city}, ${login.country}`,
        device: login.device
      }));

    res.status(200).json({ 
      status: 'success', 
      data: { riskHistory } 
    });
  } catch (err) {
    console.error('Risk history error:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
});

module.exports = router;