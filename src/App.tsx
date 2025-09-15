import React, { useState, useEffect } from 'react';
import { Shield, User, LogOut } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import WorkflowCarousel from './components/WorkflowCarousel';
import UploadDataPage from './pages/UploadDataPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/DashBoard';
import ProtectedRoute from './components/ProtectedRoute';
import { AnalysisState } from './types';
import Chatbot from "./components/Chatbot";
import DigitalTwinDemo from './components/DigitalTwinDemo';
import ComplianceSection from './components/ComplianceSection';
import OtpChallenge from './components/OtpChallenge';

interface User {
  _id: string;
  email: string;
  name: string;
  company?: string;
  hasPendingAnomaly?: boolean;
}

interface OtpChallengeState {
  required: boolean;
  userId: string;
  message: string;
  expiresIn: number;
  userEmail: string;
  riskScore: number;
}

function App() {
  const AUTH_URL = "http://localhost:5000/api";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpChallenge, setOtpChallenge] = useState<OtpChallengeState>({
    required: false,
    userId: '',
    message: '',
    expiresIn: 0,
    userEmail: '',
    riskScore: 0
  });
  const [anomalyDetected, setAnomalyDetected] = useState(false);
  const [lastRiskScore, setLastRiskScore] = useState<number>(0);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${AUTH_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.data.user);
        setAnomalyDetected(data.hasPendingAnomaly || false);
        setLastRiskScore(0);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setAnomalyDetected(false);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setAnomalyDetected(false);
    }
  };

  // In the handleLogin function in App.tsx, update the OTP challenge handling:
const handleLogin = async (email: string, password: string) => {
  setAuthLoading(true);
  setAuthError(null);

  try {
    const response = await fetch(`${AUTH_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.status === 'challenge') {
        setOtpChallenge({
          required: true,
          userId: data.userId,
          message: data.message,
          expiresIn: data.expiresInMinutes,
          userEmail: email,
          riskScore: data.riskScore,
          developmentOtp: data.developmentOtp // Include development OTP if provided
        });
        setAnomalyDetected(true);
        setLastRiskScore(data.riskScore);
        setAuthError(null);
        
        // Log development OTP if provided
        if (data.developmentOtp) {
          console.log('Development OTP for testing:', data.developmentOtp);
        }
      } else if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUser(data.data.user);
        setAnomalyDetected(false);
        setLastRiskScore(data.riskScore || 0);
        setAuthError(null);
      }
    } else {
      setAuthError(data.message || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    setAuthError('Network error. Please try again.');
    console.error('Login error:', error);
  } finally {
    setAuthLoading(false);
  }
};


  const handleSignup = async (name: string, email: string, password: string, company: string) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await fetch(`${AUTH_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, company }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUser(data.data.user);
        setAnomalyDetected(false);
        setLastRiskScore(0);
        setAuthError(null);
      } else {
        setAuthError(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setAuthError('Network error. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

// In the handleOtpVerify function in App.tsx, update it:
const handleOtpVerify = async (userId: string, otp: string) => {
  setAuthLoading(true);
  setAuthError(null);

  try {
    console.log('Verifying OTP for user:', userId, 'OTP:', otp);
    
    const response = await fetch(`${AUTH_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, otp }),
    });

    const data = await response.json();
    console.log('OTP verification response:', data);

    if (response.ok) {
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      
      // Get user data after verification
      const userResponse = await fetch(`${AUTH_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.data.user);
      }
      
      setOtpChallenge({ 
        required: false, 
        userId: '', 
        message: '', 
        expiresIn: 0,
        userEmail: '',
        riskScore: 0
      });
      setAnomalyDetected(false);
      setAuthError(null);
      
    } else {
      setAuthError(data.message || 'Invalid OTP. Please try again.');
      throw new Error(data.message || 'OTP verification failed');
    }
  } catch (err) {
    console.error('OTP verification error:', err);
    setAuthError('Network error. Please check your connection and try again.');
    throw err;
  } finally {
    setAuthLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setAuthError(null);
    setOtpChallenge({ 
      required: false, 
      userId: '', 
      message: '', 
      expiresIn: 0,
      userEmail: '',
      riskScore: 0
    });
    setAnomalyDetected(false);
    setLastRiskScore(0);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-teal-100 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-teal-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                AnomalyGuard AI
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">Home</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" className="text-gray-600 hover:text-teal-600 transition-colors">Dashboard</Link>
                    {/* Only show Upload button if authenticated AND no anomaly detected */}
                    {!anomalyDetected && (
                      <Link to="/upload" className="text-gray-600 hover:text-teal-600 transition-colors">Upload & Analyze</Link>
                    )}
                  </>
                )}
              </div>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-sm text-gray-700 hidden sm:block">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth" 
                  className="text-gray-600 hover:text-teal-600 transition-colors px-3 py-1 rounded-md hover:bg-teal-50"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Main content with padding for fixed navbar */}
        <div className="pt-16">
          <Routes>
            {/* Home route - accessible without auth */}
            <Route path="/" element={
              <>
                <Hero scrollToSection={scrollToSection} isAuthenticated={isAuthenticated} />
                <WorkflowCarousel />
                <DigitalTwinDemo />
                <ComplianceSection />
              </>
            } />

            {/* Auth route */}
            <Route 
              path="/auth" 
              element={
                isAuthenticated ? 
                  <Navigate to="/dashboard" replace /> : 
                  <AuthPage 
                    onLogin={handleLogin} 
                    onSignup={handleSignup}
                    loading={authLoading}
                    error={authError}
                    clearError={() => setAuthError(null)}
                  />
              } 
            />

            {/* Dashboard route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard 
                    onLogout={handleLogout} 
                    anomalyDetected={anomalyDetected}
                    lastRiskScore={lastRiskScore}
                  />
                </ProtectedRoute>
              } 
            />

            {/* Protected routes - only allow access to upload if no anomaly detected */}
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated && !anomalyDetected}>
                  <UploadDataPage />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* OTP Challenge Modal */}
        {otpChallenge.required && (
          <OtpChallenge
            userId={otpChallenge.userId}
            message={otpChallenge.message}
            expiresIn={otpChallenge.expiresIn}
            riskScore={otpChallenge.riskScore}
            onVerify={handleOtpVerify}
            onCancel={() => setOtpChallenge({ 
              required: false, 
              userId: '', 
              message: '', 
              expiresIn: 0,
              userEmail: '',
              riskScore: 0
            })}
            loading={authLoading}
            error={authError}
            userEmail={otpChallenge.userEmail}
          />
        )}

        {/* Chatbot */}
        <Chatbot results={null} />

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-14 mt-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-7 h-7 text-teal-400" />
                  <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                    AnomalyGuard AI
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  AI-powered anomaly detection to secure cloud logins and protect users in real time.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-teal-300">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="hover:text-white transition-colors">Real-time Detection</li>
                  <li className="hover:text-white transition-colors">Analytics Dashboard</li>
                  <li className="hover:text-white transition-colors">Automated Reports</li>
                  <li className="hover:text-white transition-colors">Multi-format Export</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-teal-300">Security</h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="hover:text-white transition-colors">Enterprise Encryption</li>
                  <li className="hover:text-white transition-colors">GDPR Compliant</li>
                  <li className="hover:text-white transition-colors">SOC 2 Certified</li>
                  <li className="hover:text-white transition-colors">24/7 Monitoring</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-teal-300">Contact</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Email: <a href="mailto:support@anomalyguard.ai" className="hover:text-white">support@anomalyguard.ai</a></li>
                  <li>Phone: <a href="tel:+1234567890" className="hover:text-white">+91 9106375472</a></li>
                  <li>Location: Ahmedabad</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} AnomalyGuard AI. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;