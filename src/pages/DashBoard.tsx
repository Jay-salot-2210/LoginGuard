import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Clock, RefreshCw, Mail, BarChart3, History } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  anomalyDetected: boolean;
  lastRiskScore: number;
}

const AnomalyGuardDashboard: React.FC<DashboardProps> = ({ onLogout, anomalyDetected, lastRiskScore }) => {
  const [anomalyStatus, setAnomalyStatus] = useState<'checking' | 'detected' | 'normal'>('checking');
  const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'failed'>('idle');
  const [otpCode, setOtpCode] = useState('');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [countdown, setCountdown] = useState(0);
  const [riskHistory, setRiskHistory] = useState<any[]>([]);
  const [showRiskHistory, setShowRiskHistory] = useState(false);

  // Initialize with props
  useEffect(() => {
    if (anomalyDetected) {
      setAnomalyStatus('detected');
      // If anomaly is detected from props, send OTP automatically
      sendOtp();
    } else {
      setAnomalyStatus('normal');
    }
    
    // Fetch risk history
    fetchRiskHistory();
  }, [anomalyDetected]);

  // Fetch risk history from backend
  const fetchRiskHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/risk-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRiskHistory(data.data.riskHistory || []);
      }
    } catch (error) {
      console.error('Failed to fetch risk history:', error);
    }
  };

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOtp = async () => {
    setOtpStatus('sending');
    
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setOtpStatus('sent');
    setCountdown(120); // 2-minute countdown
  };

  const verifyOtp = async () => {
    if (!otpCode) return;
    
    setOtpStatus('verifying');
    
    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, assume 123456 is the correct OTP
    if (otpCode === '123456') {
      setOtpStatus('verified');
      setAnomalyStatus('normal'); // Anomaly resolved after verification
    } else {
      setOtpStatus('failed');
    }
  };

  const resendOtp = () => {
    setOtpCode('');
    setOtpStatus('idle');
    sendOtp();
  };

  // Calculate risk level based on score
  const getRiskLevel = (score: number) => {
    if (score >= 0.8) return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
    if (score >= 0.5) return { level: 'Medium', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const riskInfo = getRiskLevel(lastRiskScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center shadow-sm">
              <Shield className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            AnomalyGuard AI Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitoring and protecting your cloud environment
          </p>
        </div>

        {/* Risk Score Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Current Risk Assessment</h2>
            <button 
              onClick={() => setShowRiskHistory(!showRiskHistory)}
              className="flex items-center space-x-2 text-sm text-teal-600 hover:text-teal-700"
            >
              <History className="w-4 h-4" />
              <span>{showRiskHistory ? 'Hide History' : 'View History'}</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Last Login Risk Score</h3>
                <BarChart3 className="w-5 h-5 text-teal-600" />
              </div>
              
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${riskInfo.color}`}>
                  {(lastRiskScore * 100).toFixed(1)}%
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskInfo.bg} ${riskInfo.color}`}>
                  {riskInfo.level} Risk
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {lastRiskScore >= 0.8 
                    ? 'High risk detected. Additional verification required.' 
                    : lastRiskScore >= 0.5
                    ? 'Moderate risk level. Monitor activity closely.'
                    : 'Low risk level. Normal login pattern.'
                  }
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-6">
              <h3 className="font-medium text-gray-700 mb-4">Risk Interpretation</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">0-30%</span>
                  <span className="text-sm font-medium text-green-600">Low Risk</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">30-70%</span>
                  <span className="text-sm font-medium text-amber-600">Medium Risk</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">70-100%</span>
                  <span className="text-sm font-medium text-red-600">High Risk</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk History Panel */}
        {showRiskHistory && riskHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Login History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Risk Score</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {riskHistory.map((login, index) => {
                    const loginRiskInfo = getRiskLevel(login.riskScore);
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3">{new Date(login.time).toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`font-medium ${loginRiskInfo.color}`}>
                            {(login.riskScore * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${loginRiskInfo.bg} ${loginRiskInfo.color}`}>
                            {loginRiskInfo.level}
                          </span>
                        </td>
                        <td className="py-3">{login.location}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Anomaly Status Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Anomaly Detection Status</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${
                anomalyStatus === 'checking' ? 'bg-blue-100' : 
                anomalyStatus === 'detected' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {anomalyStatus === 'checking' ? (
                  <Clock className="w-6 h-6 text-blue-600" />
                ) : anomalyStatus === 'detected' ? (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {anomalyStatus === 'checking' ? 'Checking for anomalies...' : 
                   anomalyStatus === 'detected' ? 'Anomaly Detected!' : 'System Normal'}
                </p>
                <p className="text-sm text-gray-500">
                  {anomalyStatus === 'checking' ? 'Scanning your cloud environment' : 
                   anomalyStatus === 'detected' ? 'Suspicious activity detected' : 'No anomalies found'}
                </p>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              anomalyStatus === 'checking' ? 'bg-blue-100 text-blue-800' : 
              anomalyStatus === 'detected' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {anomalyStatus.toUpperCase()}
            </div>
          </div>
        </div>

        {/* OTP Verification Section */}
        <AnimatePresence>
          {anomalyStatus === 'detected' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-md p-6 border border-orange-200"
            >
              <div className="flex items-start mb-6">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Verification Required</h2>
                  <p className="text-gray-600">
                    We've detected unusual activity. For your security, we've sent an OTP to your registered email.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-800">
                    OTP sent to: <strong>{userEmail}</strong>
                  </span>
                </div>
                {countdown > 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    OTP expires in: <span className="font-medium">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                  </p>
                )}
              </div>

              {otpStatus === 'verified' ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Identity verified successfully!</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">The anomaly has been resolved.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter 6-digit OTP"
                      disabled={otpStatus === 'sending' || otpStatus === 'verifying'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      For demo purposes, use: <span className="font-mono">123456</span>
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={verifyOtp}
                      disabled={otpCode.length !== 6 || otpStatus === 'verifying' || otpStatus === 'sending'}
                      className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
                    >
                      {otpStatus === 'verifying' ? (
                        <span className="flex items-center justify-center">
                          <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Verifying...
                        </span>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>

                    <button
                      onClick={resendOtp}
                      disabled={countdown > 0 || otpStatus === 'sending'}
                      className="px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
                    >
                      {otpStatus === 'sending' ? (
                        <RefreshCw className="animate-spin h-5 w-5" />
                      ) : (
                        'Resend OTP'
                      )}
                    </button>
                  </div>

                  {otpStatus === 'failed' && (
                    <div className="bg-red-50 p-3 text-red-700 rounded-lg text-sm">
                      Invalid OTP code. Please try again.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Info */}
        {anomalyStatus === 'normal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-6 border border-green-200"
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">All Systems Normal</h2>
                <p className="text-gray-600">
                  No anomalies detected in your cloud environment. Your systems are secure.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <div className="text-center mt-8">
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnomalyGuardDashboard;