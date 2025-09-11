// components/Hero.tsx - Updated to show CTA based on authentication status
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
  isAuthenticated: boolean;
}

const Hero: React.FC<HeroProps> = ({ scrollToSection, isAuthenticated }) => {
  return (
    <div className="pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-teal-100 px-4 py-2 rounded-full text-sm font-medium text-teal-800">
              <Shield className="w-4 h-4" />
              <span>AI-Powered Cloud Security</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Detect Anomalous Logins with{' '}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                AI Precision
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Protect your cloud environments from credential theft and account takeovers with our advanced AI system that analyzes login patterns, locations, and behaviors in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Analyze Data
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
              <button
                onClick={() => scrollToSection('workflow')}
                className="inline-flex items-center justify-center px-8 py-4 border border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-all duration-200"
              >
                How It Works
              </button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">99.8%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">100ms</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl p-1 shadow-2xl">
              <div className="bg-white rounded-xl p-6 shadow-inner">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-500">Login Activity</div>
                    <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Secure</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-teal-600">JD</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">john.doe@company.com</div>
                          <div className="text-xs text-gray-500">New York, USA • 09:42 AM</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Chrome • Windows</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-teal-600">AS</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">alice.smith@company.com</div>
                          <div className="text-xs text-gray-500">London, UK • 09:38 AM</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Safari • macOS</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-red-600">RS</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">robert.smith@company.com</div>
                          <div className="text-xs text-red-500">Moscow, Russia • 09:35 AM</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-red-600">Suspicious</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-teal-600">MJ</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">michael.jones@company.com</div>
                          <div className="text-xs text-gray-500">San Francisco, USA • 09:28 AM</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Firefox • Linux</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">AI detected 1 anomalous login in the last hour</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-teal-200 rounded-full blur-2xl opacity-30 z-[-1]"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-30 z-[-1]"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;