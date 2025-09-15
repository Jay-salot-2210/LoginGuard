import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertTriangle, Shield } from 'lucide-react';
import AnalysisSummary from '../components/AnalysisSummary';
import RiskBreakdown from '../components/RiskBreakdown';
import RegionalHeatMap from '../components/RegionalHeatMap';
import TimelineChart from '../components/TimelineChart';
import FlaggedUsersTable from '../components/FlaggedUsersTable';
import SecurityReport from '../components/SecurityReport';
import UploadSection from '../components/UploadSection';
import { AnalysisState, AnalysisResults } from '../types';

const UploadDataPage: React.FC = () => {
  const BASE_URL = "https://2f109736df5e.ngrok-free.app"; // Replace with your actual API URL
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 1024 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit');
      return;
    }
    
    // Validate file type
    const validExtensions = ['.csv', '.log'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension) && file.type !== 'text/csv') {
      setErrorMessage('Please upload a CSV or LOG file');
      return;
    }
    
    setUploadedFile(file);
    setAnalysisState('uploaded');
    setErrorMessage(null);
  };

  const handleRunAnalysis = async () => {
    if (!uploadedFile) return;
    
    setAnalysisState('processing');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch(`${BASE_URL}/predict_file`, {
        method: "POST",
        body: formData,
        headers: { 
          "Authorization": `Bearer ${token}`,
          // Don't set Content-Type header when using FormData - browser will set it automatically
        }
      });

      // Check for HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        throw new Error(errorData.detail || errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.predictions) {
        throw new Error("Invalid API response format");
      }

      // Transform API response to match your frontend types
      const predictions = data.predictions.map((p: any, index: number) => {
        let timestamp: string | null = null;
        if (p.Timestamp || p.timestamp) {
          const dateStr = p.Timestamp || p.timestamp;
          const d = new Date(dateStr);
          timestamp = isNaN(d.getTime()) ? null : d.toISOString();
        }
        
        return {
          ...p,
          id: index + 1,
          Timestamp: timestamp,
          anomaly_score: Number(p.anomaly_score ?? p.score ?? 0),
          anomaly: Number(p.anomaly ?? p.is_anomaly ?? 0),
          Location: p.Location ?? p.location ?? p.ip_location ?? "Unknown",
          UserID: p["User ID"] ?? p.user_id ?? p.UserID ?? "Unknown"
        };
      });

      // Calculate statistics
      const high = predictions.filter((p: any) => p.anomaly_score >= 0.8).length;
      const medium = predictions.filter((p: any) => p.anomaly_score >= 0.5 && p.anomaly_score < 0.8).length;
      const low = predictions.filter((p: any) => p.anomaly_score < 0.5).length;

      // Process regional data
      const regionMap: Record<string, any[]> = {};
      predictions.forEach((p: any) => {
        const loc = p.Location;
        if (!regionMap[loc]) regionMap[loc] = [];
        regionMap[loc].push(p);
      });

      const regionalData = Object.entries(regionMap).map(([region, preds]) => {
        const avgScore = preds.reduce((sum: number, p: any) => sum + p.anomaly_score, 0) / preds.length;
        const severity = avgScore >= 0.8 ? "High" : avgScore >= 0.5 ? "Medium" : "Low";
        return { region, count: preds.length, severity, avgScore };
      });

      // Process time series data
      const timeMap: Record<string, number> = {};
      predictions.forEach((p: any) => {
        if (!p.Timestamp) return;
        try {
          const hour = new Date(p.Timestamp).getHours();
          const bucket = `${hour.toString().padStart(2, "0")}:00`;
          if (p.anomaly === 1) timeMap[bucket] = (timeMap[bucket] || 0) + 1;
        } catch (e) {
          console.warn('Invalid timestamp format:', p.Timestamp);
        }
      });
      
      const timeSeriesData = Object.entries(timeMap).map(([time, anomalies]) => ({ time, anomalies }));

      // Get top flagged users
      const flaggedUsers = predictions
        .sort((a: any, b: any) => b.anomaly_score - a.anomaly_score)
        .slice(0, 10)
        .map((pred: any, idx: number) => ({
          id: idx + 1,
          user: String(pred.UserID),
          location: String(pred.Location ?? "Unknown"),
          severity: pred.anomaly_score >= 0.8 ? "High" : pred.anomaly_score >= 0.5 ? "Medium" : "Low",
          score: pred.anomaly_score,
          timestamp: pred.Timestamp ? new Date(pred.Timestamp).toLocaleString() : "N/A"
        }));

      // Transform results
      const transformedResults: AnalysisResults = {
        totalLogins: data.total_records ?? predictions.length,
        anomaliesCount: data.anomalies_detected ?? high + medium + low,
        severityBreakdown: { high, medium, low },
        flaggedUsers,
        regionalData,
        timeSeriesData,
        summary: data.summary ?? `Analysis completed. Found ${high + medium + low} anomalies in ${predictions.length} logins.`
      };

      setResults(transformedResults);
      setAnalysisState('completed');

    } catch (error: any) {
      console.error('Analysis error:', error);
      
      // Handle specific error types
      if (error.message.includes('Authentication') || error.message.includes('token')) {
        setErrorMessage('Authentication failed. Please log in again.');
        // Optionally redirect to login
        localStorage.removeItem('token');
      } else if (error.message.includes('Network')) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      }
      
      setAnalysisState('error');
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setResults(null);
    setAnalysisState('idle');
    setErrorMessage(null);
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-teal-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upload & <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Analyze</span>
            </h1>
            <p className="text-xl text-gray-600">Upload your login data and get comprehensive security analysis</p>
          </motion.div>

          {/* Upload Section */}
          <UploadSection
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
            analysisState={analysisState}
            onRunAnalysis={handleRunAnalysis}
            errorMessage={errorMessage}
            onReset={handleReset} 
          />
          {/* Reset button */}
              {/* <div className="text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
              </div> */}

          {/* Results Sections */}
          {results && analysisState === 'completed' && (
            <motion.div variants={containerVariants} className="space-y-8">
              <AnalysisSummary results={results} />
              <RiskBreakdown results={results} />
              <div className="grid lg:grid-cols-2 gap-8">
                <RegionalHeatMap results={results} />
                <TimelineChart results={results} />
              </div>
              <FlaggedUsersTable results={results} />
              <SecurityReport results={results} />
              
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadDataPage;