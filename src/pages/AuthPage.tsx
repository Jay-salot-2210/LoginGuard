import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { Shield } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (name: string, email: string, password: string, company: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, loading, error }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-teal-600" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          AnomalyGuard AI
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Secure your cloud environments with AI-powered anomaly detection
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {isLoginMode ? (
          <Login 
            onToggleMode={toggleMode} 
            onLogin={onLogin}
            loading={loading}
            error={error}
          />
        ) : (
          <Signup 
            onToggleMode={toggleMode} 
            onSignup={onSignup}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;