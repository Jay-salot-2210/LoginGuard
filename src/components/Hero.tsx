import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Upload, Play, BarChart3 } from 'lucide-react';
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
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-teal-800">
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
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Analyze Data
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
              <button
                onClick={() => scrollToSection('simulation')}
                className="inline-flex items-center justify-center px-8 py-4 bg-white border border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                View Live Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('workflow')}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
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
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">0.01%</div>
                <div className="text-sm text-gray-600">False Positives</div>
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
                    <div className="text-sm font-medium text-gray-500">Live Security Dashboard</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="text-xs font-medium text-green-800">Active</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-teal-600">AR</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">arjun.rathi@company.in</div>
                          <div className="text-xs text-gray-500">Mumbai, India • 09:42 AM</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Chrome • Windows</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-teal-600">NS</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">nisha.singh@company.in</div>
                          <div className="text-xs text-gray-500">Delhi, India • 09:38 AM</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Safari • macOS</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-red-600">RK</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">ravi.kumar@company.in</div>
                          <div className="text-xs text-red-600">Bangalore, India • 09:35 AM</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-red-600 flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                        Blocked
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-teal-600">MP</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">mohit.patel@company.in</div>
                          <div className="text-xs text-gray-500">Ahmedabad, India • 09:28 AM</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Firefox • Linux</div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-yellow-600">TS</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">tanya.sharma@company.in</div>
                          <div className="text-xs text-yellow-700">Hyderabad, India • 09:25 AM</div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-yellow-700 flex items-center">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>
                        Review
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-xs text-gray-500">AI detected 2 security events in the last hour</div>
                    <div className="text-xs font-medium text-teal-600">View Details →</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Animated background elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-teal-200 rounded-full blur-2xl opacity-30 z-[-1] animate-pulse-slow"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-30 z-[-1] animate-pulse-slow"></div>
            <div className="absolute top-1/2 -left-12 w-16 h-16 bg-teal-300 rounded-full blur-xl opacity-20 z-[-1] animate-bounce-slow"></div>
            
            {/* Floating security badges */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-md p-2 border border-teal-200">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700">System Secure</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-md p-2 border border-teal-200">
              <div className="flex items-center">
                <Shield className="w-3 h-3 text-teal-600 mr-1" />
                <span className="text-xs font-medium text-gray-700">AI Active</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col items-center text-gray-400">
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-teal-500 rounded-full mt-2"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
