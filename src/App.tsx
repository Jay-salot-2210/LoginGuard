import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hero from './components/Hero';
import WorkflowCarousel from './components/WorkflowCarousel';
import UploadDataPage from './pages/UploadDataPage';
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

function App() {
  const BASE_URL = "https://df673b7d2566.ngrok-free.app";
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);

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
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">Home</Link>
              <Link to="/upload" className="text-gray-600 hover:text-teal-600 transition-colors">Upload & Analyze</Link>
            </div>
          </div>
        </nav>

        <Routes>
          {/* Home route */}
          <Route path="/" element={
            <>
              <Hero scrollToSection={scrollToSection} />
              <WorkflowCarousel />
            </>
          } />

          {/* Upload & Analyze pages */}
          <Route path="/upload" element={<UploadDataPage />} />
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

export default App;
