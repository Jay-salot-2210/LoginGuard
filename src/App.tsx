import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import Hero from './components/Hero';
import WorkflowCarousel from './components/WorkflowCarousel';
import UploadSection from './components/UploadSection';
import ProcessingAnimation from './components/ProcessingAnimation';
import ResultsDashboard from './components/ResultsDashboard';
import ReportSection from './components/ReportSection';
import { AnalysisState, AnalysisResults } from './types';

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
  const BASE_URL = "https://3c191c8ee9b1.ngrok-free.app";
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

  const handleRunAnalysis = async () => {
    if (!uploadedFile) return;
    setAnalysisState('processing');

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await fetch(`${BASE_URL}/predict_file`, {
        method: "POST",
        body: formData,
        headers: { "ngrok-skip-browser-warning": "true" }
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const data = await response.json();

      if (!data?.predictions) throw new Error("Invalid API response");

      const predictions: Prediction[] = data.predictions.map((p: any) => ({
        anomaly_score: Number(p.anomaly_score ?? 0),
        anomaly: Number(p.anomaly ?? 0),
        Timestamp: p.Timestamp ? new Date(p.Timestamp).toISOString() : null,
        Location: p.Location ?? p.location ?? p.ip ?? "Unknown",
        UserID: p["User ID"] ?? p.user_id ?? "Unknown"
      }));

      const high = predictions.filter(p => p.anomaly_score >= 0.8).length;
      const medium = predictions.filter(p => p.anomaly_score >= 0.5 && p.anomaly_score < 0.8).length;
      const low = predictions.filter(p => p.anomaly_score < 0.5).length;

      const regionMap: Record<string, Prediction[]> = {};
      predictions.forEach(p => {
        const loc = p.Location;
        if (!regionMap[loc]) regionMap[loc] = [];
        regionMap[loc].push(p);
      });

      const regionalData = Object.entries(regionMap).map(([region, preds]) => {
        const avgScore = preds.reduce((sum, p) => sum + p.anomaly_score, 0) / preds.length;
        const severity: 'High' | 'Medium' | 'Low' = avgScore >= 0.8 ? "High" : avgScore >= 0.5 ? "Medium" : "Low";
        return { region, count: preds.length, severity };
      });

      const timeMap: Record<string, number> = {};
      predictions.forEach(p => {
        if (!p.Timestamp) return;
        const hour = new Date(p.Timestamp).getHours();
        const bucket = `${hour.toString().padStart(2, "0")}:00`;
        if (p.anomaly === 1) timeMap[bucket] = (timeMap[bucket] || 0) + 1;
      });
      const timeSeriesData = Object.entries(timeMap).map(([time, anomalies]) => ({ time, anomalies }));

      // Safe flagged users
      const flaggedUsers: FlaggedUser[] = predictions
        .sort((a, b) => b.anomaly_score - a.anomaly_score)
        .slice(0, 10)
        .map((pred, idx) => ({
          id: idx + 1,
          user: String(pred.UserID), // ✅ ensure string
          location: String(pred.Location ?? "Unknown"),
          severity: pred.anomaly_score >= 0.8 ? "High" : pred.anomaly_score >= 0.5 ? "Medium" : "Low",
          score: pred.anomaly_score,
          timestamp: pred.Timestamp ? new Date(pred.Timestamp).toLocaleString() : "N/A"
        }));

      const transformedResults: AnalysisResults = {
        totalLogins: data.total_records ?? predictions.length,
        anomaliesCount: data.anomalies_detected ?? high + medium + low,
        severityBreakdown: { high, medium, low },
        flaggedUsers,
        regionalData,
        timeSeriesData,
        summary: data.summary ?? "Analysis completed successfully."
      };

      setResults(transformedResults);
      setAnalysisState('completed');
      setTimeout(() => scrollToSection('results'), 500);

    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisState('error');
    }
  };

  const handleReset = () => {
    setAnalysisState('idle');
    setUploadedFile(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-teal-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-teal-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              AnomalyGuard AI
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('hero')} className="text-gray-600 hover:text-teal-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('workflow')} className="text-gray-600 hover:text-teal-600 transition-colors">How it Works</button>
            <button onClick={() => scrollToSection('upload')} className="text-gray-600 hover:text-teal-600 transition-colors">Try Now</button>
            <button onClick={handleReset} className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl">Reset Demo</button>
          </div>
        </div>
      </nav>

      {/* Hero, Workflow, Upload */}
      <Hero scrollToSection={scrollToSection} />
      <WorkflowCarousel />
      <UploadSection
        onFileUpload={handleFileUpload}
        uploadedFile={uploadedFile}
        analysisState={analysisState}
        onRunAnalysis={handleRunAnalysis}
      />

      {analysisState === 'processing' && <ProcessingAnimation />}
      {results && (analysisState === 'completed' || analysisState === 'processing') && <ResultsDashboard results={results} />}
      {results && analysisState === 'completed' && <ReportSection results={results} />}

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
  );
}

export default App;
