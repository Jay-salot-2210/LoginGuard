import React, { useState, useEffect } from 'react';
import { Shield, Activity, CheckCircle } from 'lucide-react';

const ProcessingAnimation: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const processingSteps = [
    "Uploading and validating file...",
    "Extracting login patterns...",
    "Analyzing user behaviors...",
    "Detecting anomalies with AI...",
    "Calculating risk scores...",
    "Generating insights...",
    "Preparing results..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(stepInterval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
              Analyzing
            </span>{' '}
            Your Data
          </h2>
          <p className="text-xl text-gray-300">
            Our AI engine is processing your login data to identify potential security threats
          </p>
        </div>

        {/* Animated Shield */}
        <div className="relative mb-12">
          <div className="flex justify-center">
            <div className="relative">
              <Shield 
                className="w-24 h-24 text-cyan-400 animate-pulse"
                style={{
                  animation: 'rotate 3s linear infinite, pulse 2s ease-in-out infinite alternate'
                }}
              />
              <div className="absolute inset-0 animate-ping opacity-30">
                <Shield className="w-24 h-24 text-cyan-400" />
              </div>
            </div>
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            <Activity className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-6 h-6 text-teal-400" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
            <Activity className="absolute bottom-0 right-0 w-6 h-6 text-blue-400" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
            <Activity className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 w-6 h-6 text-cyan-300" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full
                         transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                           transform -skew-x-12 animate-shimmer"
                style={{
                  animation: 'shimmer 2s infinite'
                }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Processing...</span>
            <span>{Math.round(Math.min(progress, 100))}%</span>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {processingSteps.map((step, index) => (
            <div 
              key={index}
              className={`flex items-center justify-center space-x-3 transition-all duration-500 ${
                index <= currentStep ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : index === currentStep ? (
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-600 rounded-full flex-shrink-0" />
              )}
              <span className={`text-lg ${
                index <= currentStep ? 'text-white' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Processing stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-cyan-400">2.3M</div>
            <div className="text-sm text-gray-400">Records Analyzed</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-teal-400">847</div>
            <div className="text-sm text-gray-400">Patterns Found</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-blue-400">47</div>
            <div className="text-sm text-gray-400">Anomalies Detected</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-cyan-300">97%</div>
            <div className="text-sm text-gray-400">Accuracy Rate</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
      `}</style>
    </section>
  );
};

export default ProcessingAnimation;