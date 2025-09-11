<<<<<<< HEAD
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import WorkflowCarousel from './components/WorkflowCarousel';
import UploadDataPage from './pages/UploadDataPage';
=======
import React, { useState, useEffect } from 'react';
import { Shield, User, LogOut } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import WorkflowCarousel from './components/WorkflowCarousel';
import UploadDataPage from './pages/UploadDataPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
>>>>>>> d829c81d (first commit)
import { AnalysisState, AnalysisResults } from './types';
import Chatbot from "./components/Chatbot";

// Define proper types
interface Prediction {
  anomaly_score: number;
  anomaly: number;
  Timestamp: string | null;
  Location: string;
  UserID: string;
}

interface FlaggedUser {
  id: number;
  user: string;
  location: string;
  severity: 'High' | 'Medium' | 'Low';
  score: number;
  timestamp: string;
}

<<<<<<< HEAD
function App() {
  const BASE_URL = "https://df673b7d2566.ngrok-free.app";
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
=======
interface User {
  _id: string;
  email: string;
  name: string;
  company?: string;
}

function App() {
  const BASE_URL = "https://df673b7d2566.ngrok-free.app";
  const AUTH_URL = "http://localhost:5000/api"; // Your backend URL
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
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
        const userData = await response.json();
        setIsAuthenticated(true);
        setUser(userData.data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
    }
  };

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
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUser(data.data.user);
      } else {
        setAuthError(data.message || 'Login failed');
      }
    } catch (error) {
      setAuthError('Network error. Please try again.');
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
      } else {
        setAuthError(data.message || 'Signup failed');
      }
    } catch (error) {
      setAuthError('Network error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };
>>>>>>> d829c81d (first commit)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisState('uploaded');
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setUploadedFile(null);
    setResults(null);
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
<<<<<<< HEAD
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">Home</Link>
              <Link to="/upload" className="text-gray-600 hover:text-teal-600 transition-colors">Upload & Analyze</Link>
=======
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">Home</Link>
                {isAuthenticated && (
                  <Link to="/upload" className="text-gray-600 hover:text-teal-600 transition-colors">Upload & Analyze</Link>
                )}
              </div>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-sm text-gray-700">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="text-gray-600 hover:text-teal-600 transition-colors">
                  Login
                </Link>
              )}
>>>>>>> d829c81d (first commit)
            </div>
          </div>
        </nav>

        <Routes>
<<<<<<< HEAD
          {/* Home route */}
          <Route path="/" element={
            <>
              <Hero scrollToSection={scrollToSection} />
=======
          {/* Home route - accessible without auth */}
          <Route path="/" element={
            <>
              <Hero scrollToSection={scrollToSection} isAuthenticated={isAuthenticated} />
>>>>>>> d829c81d (first commit)
              <WorkflowCarousel />
            </>
          } />

<<<<<<< HEAD
          {/* Upload & Analyze pages */}
          <Route path="/upload" element={<UploadDataPage />} />
=======
          {/* Auth route */}
          <Route 
            path="/auth" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <AuthPage 
                  onLogin={handleLogin} 
                  onSignup={handleSignup}
                  loading={authLoading}
                  error={authError}
                />
            } 
          />

          {/* Protected routes */}
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UploadDataPage />
              </ProtectedRoute>
            } 
          />
>>>>>>> d829c81d (first commit)
        </Routes>

        {/* Chatbot receives results dynamically */}
        <Chatbot results={results} />

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
                  <li>Phone: <a href="tel:+1234567890" className="hover:text-white">+1 (234) 567-890</a></li>
                  <li>Location: Remote-first 🌍</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} AnomalyGuard AI. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> d829c81d (first commit)
