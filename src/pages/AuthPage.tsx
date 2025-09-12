import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { Shield, X } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (name: string, email: string, password: string, company: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ 
  onLogin, 
  onSignup, 
  loading, 
  error, 
  clearError 
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    clearError();
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Global Error Banner */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-auto z-50"
        >
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-md flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button 
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center shadow-sm">
            <Shield className="w-8 h-8 text-teal-600" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6 text-center text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
        >
          AnomalyGuard AI
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-2 text-center text-sm text-gray-600"
        >
          Secure your cloud environments with AI-powered anomaly detection
        </motion.p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLoginMode ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLoginMode ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLoginMode ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {isLoginMode ? (
              <Login 
                onToggleMode={toggleMode} 
                onLogin={onLogin}
                loading={loading}
                error={null}
              />
            ) : (
              <Signup 
                onToggleMode={toggleMode} 
                onSignup={onSignup}
                loading={loading}
                error={null}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;