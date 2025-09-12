// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/email');
const { assessLogin, makeFingerprintFromReq, getIpFromReq } = require('../utils/anomalyDetector');
const anomalyDetector = require('../middleware/anomalyDetector'); // Add this

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// ---------- SIGNUP ----------
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, company } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ status: 'fail', message: 'Email already registered' });
    }

    const user = await User.create({ email, password, name, company });
    user.password = undefined;
    
    // Sign token for immediate login after signup
    const token = signToken(user._id);
    res.status(201).json({ status: 'success', data: { user, token }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// ---------- LOGIN (with anomaly detection + OTP challenge) ----------
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'fail', message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password +otpHash +otpExpires trustedDevices loginHistory');
    if (!user) return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });

    const correct = await user.correctPassword(password, user.password);
    if (!correct) return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });

    // Attach user to request for middleware
    req.user = user;
    
    // Call next to proceed to anomaly detection middleware
    next();
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
}, anomalyDetector, async (req, res) => {
  // This is the final handler after anomaly detection
  try {
    const user = req.user;
    
    // Check if anomaly detection middleware set a challenge requirement
    if (res.anomalyChallengeRequired) {
      // Anomalous: create OTP, email it, save otpHash + expiry to user
      const otpLength = Number(process.env.OTP_LENGTH || 6);
      const otp = (Math.floor(Math.random() * Math.pow(10, otpLength))).toString().padStart(otpLength, '0');

      const otpHash = await bcrypt.hash(otp, 12);
      const expires = Date.now() + (Number(process.env.OTP_EXPIRES_MINUTES || 30) * 60 * 1000);

      user.otpHash = otpHash;
      user.otpExpires = new Date(expires);

      // Save login history
      const fingerprint = makeFingerprintFromReq(req);
      const ip = getIpFromReq(req);
      const geo = ip ? require('geoip-lite').lookup(ip) || {} : {};
      
      user.loginHistory = user.loginHistory || [];
      user.loginHistory.push({
        ip: ip,
        country: geo.country || '',
        city: geo.city || '',
        device: req.headers['user-agent'] || '',
        time: new Date(),
        status: 'challenged',
        riskScore: req.riskScore
      });

      await user.save();

      try {
        await sendOtpEmail(user.email, otp, user.name);
      } catch (mailErr) {
        console.error('Failed to send OTP email:', mailErr);
      }

      return res.status(200).json({
        status: 'challenge',
        message: 'Suspicious login detected. An OTP has been sent to the registered email.',
        userId: user._id,
        riskScore: req.riskScore,
        expiresInMinutes: Number(process.env.OTP_EXPIRES_MINUTES || 30)
      });
    } else {
      // Normal login: update device info and login history
      const fingerprint = makeFingerprintFromReq(req);
      const ip = getIpFromReq(req);
      const geo = ip ? require('geoip-lite').lookup(ip) || {} : {};
      
      // Update trusted devices if this device is already trusted
      const foundIndex = (user.trustedDevices || []).findIndex(d => d.fingerprint === fingerprint);
      if (foundIndex !== -1) {
        user.trustedDevices[foundIndex].lastSeen = new Date();
      }
      
      // Add to login history
      user.loginHistory = user.loginHistory || [];
      user.loginHistory.push({
        ip: ip,
        country: geo.country || '',
        city: geo.city || '',
        device: req.headers['user-agent'] || '',
        time: new Date(),
        status: 'success',
        riskScore: req.riskScore || 0
      });

      await user.save();

      const token = signToken(user._id);
      user.password = undefined;
      user.otpHash = undefined;
      user.otpExpires = undefined;
      
      return res.status(200).json({ 
        status: 'success', 
        token, 
        data: { user },
        riskScore: req.riskScore || 0
      });
    }
  } catch (err) {
    console.error('Error in login final handler:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
});

// ---------- VERIFY OTP (issue token after success) ----------
router.post('/verify-otp', async (req, res) => {
  try {
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

    user.clearOtp();
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

// Add a route to verify tokens
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ status: 'fail', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
});

module.exports = router;