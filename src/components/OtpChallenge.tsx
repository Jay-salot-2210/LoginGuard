import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Mail } from 'lucide-react';

interface OtpChallengeProps {
  userId: string;
  message: string;
  expiresIn: number;
  onVerify: (userId: string, otp: string) => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
  userEmail?: string;
}

const OtpChallenge: React.FC<OtpChallengeProps> = ({
  userId,
  message,
  expiresIn,
  onVerify,
  onCancel,
  loading,
  error,
  userEmail
}) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(expiresIn * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(userId, otp);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">AnomalyGuard AI</h2>
            <p className="text-red-600 font-medium mb-4">Anomaly Detected</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500 mt-1 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-red-800 font-medium">Suspicious activity detected</p>
                <p className="text-xs text-red-700 mt-1">DETECTED</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Verification Required</h3>
            <p className="text-gray-600 text-sm mb-4">
              We've detected unusual activity. For your security, we've sent an OTP to your registered email.
            </p>
            
            {userEmail && (
              <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg mb-3">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-blue-700">
                  OTP sent to: <strong>{userEmail}</strong>
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center bg-amber-50 p-3 rounded-lg">
              <span className="text-sm text-amber-700">OTP expires in:</span>
              <span className={`font-mono font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-amber-600'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setOtp(value.slice(0, 6));
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center text-xl font-mono"
              placeholder="000000"
              autoComplete="one-time-code"
              autoFocus
            />
            
            <div className="mt-3 text-xs text-gray-500 text-center">
              For demo purposes, use: <span className="font-mono bg-gray-100 px-2 py-1 rounded">123456</span>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={otp.length !== 6 || loading || timeLeft <= 0}
                className="flex-1 py-3 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-teal-600 hover:text-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={timeLeft > (expiresIn * 60 - 30)}
            >
              Resend OTP
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OtpChallenge;