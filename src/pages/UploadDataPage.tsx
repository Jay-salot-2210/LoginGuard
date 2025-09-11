import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Upload, FileText, AlertTriangle } from 'lucide-react';
=======
import { Upload, FileText, AlertTriangle, Shield } from 'lucide-react';
>>>>>>> d829c81d (first commit)
import AnalysisSummary from '../components/AnalysisSummary';
import RiskBreakdown from '../components/RiskBreakdown';
import RegionalHeatMap from '../components/RegionalHeatMap';
import TimelineChart from '../components/TimelineChart';
import FlaggedUsersTable from '../components/FlaggedUsersTable';
import SecurityReport from '../components/SecurityReport';
<<<<<<< HEAD
import { AnalysisState, AnalysisResults } from '../types';

const UploadDataPage: React.FC = () => {
  const BASE_URL = "https://605939d9cdfc.ngrok-free.app";
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisState('uploaded');
    setErrorMessage(null); // reset previous errors
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.log'))) {
      handleFileUpload(file);
    }
=======
import UploadSection from '../components/UploadSection';
import { AnalysisState, AnalysisResults } from '../types';

const UploadDataPage: React.FC = () => {
  const BASE_URL = "https://7a00a83e6ebb.ngrok-free.app"; // Replace with your actual API URL
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
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
>>>>>>> d829c81d (first commit)
  };

  const handleRunAnalysis = async () => {
    if (!uploadedFile) return;
<<<<<<< HEAD
    setAnalysisState('processing');
    setErrorMessage(null); // reset previous error
=======
    
    setAnalysisState('processing');
    setErrorMessage(null);
>>>>>>> d829c81d (first commit)

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
<<<<<<< HEAD
      const response = await fetch(`${BASE_URL}/predict_file`, {
        method: "POST",
        body: formData,
        headers: { "ngrok-skip-browser-warning": "true" }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || response.statusText || 'Unknown API error');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (!data?.predictions) throw new Error("Invalid API response");

      const predictions = data.predictions.map((p: any) => {
        let timestamp: string | null = null;
        if (p.Timestamp) {
          const d = new Date(p.Timestamp);
          timestamp = isNaN(d.getTime()) ? null : d.toISOString();
        }
        return {
          ...p,
          Timestamp: timestamp,
          anomaly_score: Number(p.anomaly_score ?? 0),
          anomaly: Number(p.anomaly ?? 0),
          Location: p.Location ?? p.location ?? p.ip ?? "Unknown",
          UserID: p["User ID"] ?? p.user_id ?? "Unknown"
        };
      });

      const high = predictions.filter(p => p.anomaly_score >= 0.8).length;
      const medium = predictions.filter(p => p.anomaly_score >= 0.5 && p.anomaly_score < 0.8).length;
      const low = predictions.filter(p => p.anomaly_score < 0.5).length;

      const regionMap: Record<string, any[]> = {};
      predictions.forEach(p => {
=======
      // Get authentication token
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch(`${BASE_URL}/predict`, {
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
>>>>>>> d829c81d (first commit)
        const loc = p.Location;
        if (!regionMap[loc]) regionMap[loc] = [];
        regionMap[loc].push(p);
      });

      const regionalData = Object.entries(regionMap).map(([region, preds]) => {
<<<<<<< HEAD
        const avgScore = preds.reduce((sum, p) => sum + p.anomaly_score, 0) / preds.length;
=======
        const avgScore = preds.reduce((sum: number, p: any) => sum + p.anomaly_score, 0) / preds.length;
>>>>>>> d829c81d (first commit)
        const severity = avgScore >= 0.8 ? "High" : avgScore >= 0.5 ? "Medium" : "Low";
        return { region, count: preds.length, severity, avgScore };
      });

<<<<<<< HEAD
      const timeMap: Record<string, number> = {};
      predictions.forEach(p => {
        if (!p.Timestamp) return;
        const hour = new Date(p.Timestamp).getHours();
        const bucket = `${hour.toString().padStart(2, "0")}:00`;
        if (p.anomaly === 1) timeMap[bucket] = (timeMap[bucket] || 0) + 1;
      });
      const timeSeriesData = Object.entries(timeMap).map(([time, anomalies]) => ({ time, anomalies }));

      const flaggedUsers = predictions
        .sort((a, b) => b.anomaly_score - a.anomaly_score)
        .slice(0, 10)
        .map((pred, idx) => ({
=======
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
>>>>>>> d829c81d (first commit)
          id: idx + 1,
          user: String(pred.UserID),
          location: String(pred.Location ?? "Unknown"),
          severity: pred.anomaly_score >= 0.8 ? "High" : pred.anomaly_score >= 0.5 ? "Medium" : "Low",
          score: pred.anomaly_score,
          timestamp: pred.Timestamp ? new Date(pred.Timestamp).toLocaleString() : "N/A"
        }));

<<<<<<< HEAD
=======
      // Transform results
>>>>>>> d829c81d (first commit)
      const transformedResults: AnalysisResults = {
        totalLogins: data.total_records ?? predictions.length,
        anomaliesCount: data.anomalies_detected ?? high + medium + low,
        severityBreakdown: { high, medium, low },
        flaggedUsers,
        regionalData,
        timeSeriesData,
<<<<<<< HEAD
        summary: data.summary ?? "Analysis completed successfully."
=======
        summary: data.summary ?? `Analysis completed. Found ${high + medium + low} anomalies in ${predictions.length} logins.`
>>>>>>> d829c81d (first commit)
      };

      setResults(transformedResults);
      setAnalysisState('completed');

    } catch (error: any) {
      console.error('Analysis error:', error);
<<<<<<< HEAD
      setErrorMessage(error.message);
=======
      
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
      
>>>>>>> d829c81d (first commit)
      setAnalysisState('error');
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setResults(null);
    setAnalysisState('idle');
    setErrorMessage(null);
<<<<<<< HEAD
    if (fileInputRef.current) fileInputRef.current.value = "";
=======
>>>>>>> d829c81d (first commit)
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
<<<<<<< HEAD
=======
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-teal-600" />
            </div>
>>>>>>> d829c81d (first commit)
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upload & <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Analyze</span>
            </h1>
            <p className="text-xl text-gray-600">Upload your login data and get comprehensive security analysis</p>
          </motion.div>

          {/* Upload Section */}
<<<<<<< HEAD
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isDragging ? 'border-teal-500 bg-teal-50' :
                  uploadedFile ? 'border-green-500 bg-green-50' :
                  'border-gray-300 hover:border-teal-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.log"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                {uploadedFile ? (
                  <div className="space-y-4">
                    <FileText className="w-16 h-16 text-green-500 mx-auto" />
                    <div>
                      <h3 className="text-xl font-semibold text-green-700">{uploadedFile.name}</h3>
                      <p className="text-green-600">Ready for analysis</p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleRunAnalysis}
                        disabled={analysisState === 'processing'}
                        className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 transition-all duration-200"
                      >
                        {analysisState === 'processing' ? 'Analyzing...' : 'Run Analysis'}
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700">Drop your files here</h3>
                      <p className="text-gray-500">or click to browse</p>
                    </div>
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-blue-600 cursor-pointer transition-all duration-200"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Processing Animation */}
          {analysisState === 'processing' && (
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
              <div className="animate-spin w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Analyzing Your Data</h3>
              <p className="text-gray-300">Our AI is processing your login data...</p>
            </motion.div>
          )}
=======
          <UploadSection
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
            analysisState={analysisState}
            onRunAnalysis={handleRunAnalysis}
            errorMessage={errorMessage}
          />
>>>>>>> d829c81d (first commit)

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
<<<<<<< HEAD
            </motion.div>
          )}

          {/* Error State */}
          {analysisState === 'error' && errorMessage && (
            <motion.div variants={itemVariants} className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-700 mb-2">Analysis Failed</h3>
              <p className="text-red-600">{errorMessage}</p>
=======
              
              {/* Reset button */}
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Analyze Another File
                </button>
              </div>
>>>>>>> d829c81d (first commit)
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default UploadDataPage;
=======
export default UploadDataPage;
>>>>>>> d829c81d (first commit)
