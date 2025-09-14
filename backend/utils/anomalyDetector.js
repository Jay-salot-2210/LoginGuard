// backend/utils/anomalyDetector.js
const geoip = require('geoip-lite');
const crypto = require('crypto');

// Original functions from your code
function makeFingerprintFromReq(req) {
  const ua = req.headers['user-agent'] || '';
  const lang = req.headers['accept-language'] || '';
  const secCh = req.headers['sec-ch-ua'] || '';
  const ip = getIpFromReq(req);
  const raw = `${ua}|${lang}|${secCh}|${ip}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function getIpFromReq(req) {
  let ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';
  if (ip && ip.indexOf(',') !== -1) ip = ip.split(',')[0].trim();
  if (ip && ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
  return ip;
}

function assessLogin({ req, user }, threshold = Number(process.env.ANOMALY_THRESHOLD || 2)) {
  const reasons = [];
  const fingerprint = makeFingerprintFromReq(req);
  const ip = getIpFromReq(req);
  const geo = ip ? geoip.lookup(ip) || {} : {};
  const country = geo.country || 'unknown';
  const city = geo.city || '';
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentDay = currentTime.getDay(); // 0 = Sunday, 6 = Saturday

  // 1) Check for new country
  const prevCountries = new Set((user.loginHistory || []).map(h => h.country).filter(Boolean));
  if (prevCountries.size > 0 && !prevCountries.has(country)) {
    reasons.push('new_country');
  }

  // 2) Check for new device
  const deviceFound = (user.trustedDevices || []).some(d => d.fingerprint === fingerprint);
  if (!deviceFound) reasons.push('new_device');

  // 3) Check for unusual time (based on user's historical patterns)
  const prevHours = (user.loginHistory || []).map(h => new Date(h.time).getHours());
  let unusualTime = false;
  
  if (prevHours.length >= 5) {
    // Calculate average login hour and standard deviation
    const avgHour = prevHours.reduce((sum, h) => sum + h, 0) / prevHours.length;
    const stdDev = Math.sqrt(prevHours.reduce((sum, h) => sum + Math.pow(h - avgHour, 2), 0) / prevHours.length);
    
    // If current time is more than 2 standard deviations from average, flag as unusual
    if (Math.abs(currentHour - avgHour) > 2 * stdDev) {
      unusualTime = true;
    }
  } else if (prevHours.length >= 3) {
    // Simple check for new users with few logins
    const withinRange = prevHours.some(h => {
      const diff = Math.abs(h - currentHour);
      return diff <= 3 || diff >= 21; // Account for wrap-around
    });
    if (!withinRange) {
      unusualTime = true;
    }
  }
  
  if (unusualTime) reasons.push('unusual_time');

  // 4) Check for weekend/weekday pattern anomalies
  const isWeekend = currentDay === 0 || currentDay === 6;
  const prevWeekendLogins = (user.loginHistory || []).filter(h => {
    const day = new Date(h.time).getDay();
    return day === 0 || day === 6;
  }).length;
  
  const totalLogins = user.loginHistory.length || 1;
  const weekendLoginRatio = prevWeekendLogins / totalLogins;
  
  if ((isWeekend && weekendLoginRatio < 0.1) || (!isWeekend && weekendLoginRatio > 0.5)) {
    reasons.push('unusual_day_pattern');
  }

  // 5) Check velocity (multiple rapid login attempts)
  const recentLogins = (user.loginHistory || [])
    .filter(h => new Date() - new Date(h.time) < 30 * 60 * 1000) // Last 30 minutes
    .length;
  
  if (recentLogins > 3) {
    reasons.push('high_velocity');
  }

  const score = reasons.length;
  const isAnomalous = score >= threshold;

  return {
    isAnomalous,
    score,
    reasons,
    fingerprint,
    ip,
    country,
    city
  };
}

// New function to get risk score from ML model
async function getRiskScoreFromML(loginData) {
  try {
    // Simulate ML processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Base risk score (0.1 to 0.9)
    let riskScore = Math.random() * 0.8 + 0.1;
    
    // Increase risk for certain conditions
    if (loginData.userAgent.includes('Unknown') || loginData.userAgent.includes('Bot')) {
      riskScore += 0.2;
    }
    
    // Normalize to 0-1 range
    riskScore = Math.min(Math.max(riskScore, 0), 1);
    
    return riskScore;
  } catch (error) {
    console.error('Error getting risk score from ML model:', error);
    return 0.5; // Default to medium risk if model fails
  }
}

// Legacy function for backward compatibility - keep this for existing code
const assessLoginLegacy = (loginData) => {
  return getRiskScoreFromML(loginData);
};

module.exports = { 
  assessLogin, 
  makeFingerprintFromReq, 
  getIpFromReq,
  getRiskScoreFromML,
  assessLoginLegacy // For backward compatibility
};