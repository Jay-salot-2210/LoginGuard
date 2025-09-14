// backend/middleware/anomalyDetector.js
const { assessLogin, getRiskScoreFromML } = require('../utils/anomalyDetector');

const anomalyDetector = async (req, res, next) => {
  try {
    // Skip anomaly detection for certain routes (like OTP verification)
    if (req.path.includes('/verify-otp') || req.path.includes('/signup')) {
      return next();
    }

    // Only process login requests
    if (req.path.includes('/login') && req.method === 'POST') {
      // This middleware will be placed after authentication
      // req.user should be available at this point
      if (!req.user) {
        return next();
      }

      // Get risk score from ML model
      const loginData = {
        userId: req.user._id,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date(),
      };
      
      const riskScore = await getRiskScoreFromML(loginData);
      req.riskScore = riskScore;

      // Use the ML risk score for decision making
      if (riskScore < 0.3) {
        // LOW RISK: Allow login
        console.log(`Login ALLOWED for user ${req.user.email}. Risk score: ${riskScore}`);
        next();
      } else if (riskScore >= 0.3 && riskScore < 0.7) {
        // MEDIUM RISK: Flag but allow login
        console.log(`Login FLAGGED for user ${req.user.email}. Risk score: ${riskScore}`);
        // You might want to log this to a security dashboard
        next();
      } else {
        // HIGH RISK: Challenge the user
        console.log(`Login CHALLENGED for user ${req.user.email}. Risk score: ${riskScore}`);
        
        // Set response to indicate challenge is required
        res.anomalyChallengeRequired = true;
        res.anomalyData = {
          userId: req.user._id,
          riskScore: riskScore,
          message: 'Additional verification required due to suspicious login attempt'
        };
        
        // IMPORTANT: Call next() to continue to the final handler
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.error('Error in anomaly detection middleware:', error);
    // On error, proceed with login but log the issue
    next();
  }
};

module.exports = anomalyDetector;