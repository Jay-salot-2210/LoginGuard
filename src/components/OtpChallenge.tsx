import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, X, Clock, Mail } from 'lucide-react';

interface OtpChallengeProps {
  userId: string;
  message: string;
  expiresIn: number;
  riskScore: number;
  onVerify: (userId: string, otp: string) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
  userEmail: string;
}

const OtpChallenge: React.FC<OtpChallengeProps> = ({
  userId,
  message,
  expiresIn,
  riskScore,
  onVerify,
  onCancel,
  loading,
  error,
  userEmail
}) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(expiresIn * 60); // Convert minutes to seconds

  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    try {
      await onVerify(userId, otp);
    } catch (err) {
      console.error('OTP verification error:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Security Verification</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Risk Score */}
          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">Risk Level:</span>
              <span className="text-sm font-bold text-orange-600">
                {((riskScore || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(riskScore || 0) * 100}%` }}
              />
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-600 mb-4">{message}</p>

          {/* Email Info */}
          {userEmail && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  OTP sent to: <strong>{userEmail}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Countdown Timer */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center">
              <Clock className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                OTP expires in: {formatTime(countdown)}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 text-center text-xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
                disabled={loading}
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || countdown === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>

          {/* Development Hint */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                Development tip: Check your email or console for the OTP code
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OtpChallenge;