import React, { useRef, useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Play, Loader2 } from 'lucide-react';
import { AnalysisState } from '../types';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  analysisState: AnalysisState;
  onRunAnalysis: () => void;
  errorMessage?: string | null;
  onReset: () => void;   // <-- Added Reset prop
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onFileUpload,
  uploadedFile,
  analysisState,
  onRunAnalysis,
  errorMessage,
  onReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragCounter(0);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.log') || file.type === 'text/csv')) {
      onFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section id="upload" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Upload area */}
        <div className="mb-8">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-teal-500 bg-teal-50'
                : uploadedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.log,text/csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {analysisState === 'processing' ? (
              <div className="space-y-4">
                <Loader2 className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
                <div>
                  <h3 className="text-xl font-semibold text-blue-700">Analyzing Your Data</h3>
                  <p className="text-blue-600">Please wait while we process your file...</p>
                </div>
              </div>
            ) : uploadedFile ? (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">File Uploaded Successfully!</h3>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
                    <div className="flex items-center justify-center space-x-3">
                      <File className="w-6 h-6 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                  </div>
                  {/* Reset button also available when file uploaded */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={onReset}
                      className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors shadow"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className={`w-16 h-16 mx-auto transition-colors ${
                  isDragging ? 'text-teal-500' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Drag and drop your files here
                  </h3>
                  <p className="text-gray-500 mb-4">or click to browse files</p>

                  {/* Upload + Reset buttons side by side */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={handleButtonClick}
                      className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg
                               hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Choose File
                    </button>

                    <button
                      onClick={onReset}
                      className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors shadow"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400">Supports CSV and LOG files up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Run Analysis Button */}
        {uploadedFile && analysisState !== 'processing' && analysisState !== 'completed' && (
          <div className="text-center">
            <button
              onClick={onRunAnalysis}
              disabled={analysisState === 'processing'}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl
                       hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center space-x-3 mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Run Anomaly Analysis</span>
            </button>
            <p className="text-sm text-gray-500 mt-3">
              This will send your data to our secure AI engine for analysis
            </p>
          </div>
        )}

        {/* Error state */}
        {analysisState === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Analysis Failed</h3>
            <p className="text-red-600">
              {errorMessage || 'There was an error processing your file. Please try again or contact support.'}
            </p>
          </div>
        )}

        {/* Success state */}
        {analysisState === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">Analysis Complete!</h3>
            <p className="text-green-600">
              Your file has been successfully analyzed. View the results below.
            </p>
          </div>
        )}

        {/* File format info */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-3">Expected File Format</h4>
          <p className="text-blue-800 mb-3">
            Your CSV file should contain the following columns for optimal analysis:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p><span className="font-medium">user_id:</span> User identifier or email</p>
              <p><span className="font-medium">timestamp:</span> Login timestamp (ISO format)</p>
              <p><span className="font-medium">ip_address:</span> User's IP address</p>
            </div>
            <div className="space-y-1">
              <p><span className="font-medium">location:</span> Geographic location</p>
              <p><span className="font-medium">device:</span> Device information</p>
              <p><span className="font-medium">success:</span> Login success status (true/false)</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-mono">
              user_id,timestamp,ip_address,location,device,success<br/>
              user1@example.com,2023-10-15T09:30:00Z,192.168.1.1,New York,Chrome Windows,true<br/>
              user2@example.com,2023-10-15T10:15:00Z,103.21.244.0,Tokyo,Safari macOS,false
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
