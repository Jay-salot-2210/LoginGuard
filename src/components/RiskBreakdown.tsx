import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { AnalysisResults } from '../types';

interface RiskBreakdownProps {
  results: AnalysisResults;
}

const RiskBreakdown: React.FC<RiskBreakdownProps> = ({ results }) => {
  const riskLevels = [
    {
      level: 'High Risk',
      count: results.severityBreakdown.high,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      textColor: 'text-red-700'
    },
    {
      level: 'Medium Risk',
      count: results.severityBreakdown.medium,
      icon: AlertCircle,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-100',
      textColor: 'text-orange-700'
    },
    {
      level: 'Low Risk',
      count: results.severityBreakdown.low,
      icon: CheckCircle,
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-100',
      textColor: 'text-green-700'
    }
  ];

  const total = results.severityBreakdown.high + results.severityBreakdown.medium + results.severityBreakdown.low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Risk Severity Breakdown</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {riskLevels.map((risk, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              transition: { type: "spring", stiffness: 300 }
            }}
            className={`bg-gradient-to-br ${risk.bgColor} rounded-2xl p-6 text-center border border-white/50 
                       shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`w-16 h-16 bg-gradient-to-r ${risk.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <risk.icon className="w-8 h-8 text-white" />
            </div>
            
            <div className="text-4xl font-bold text-gray-900 mb-2">{risk.count}</div>
            <div className={`text-lg font-semibold ${risk.textColor} mb-4`}>{risk.level}</div>
            
            {/* Progress bar */}
            <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${risk.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${total > 0 ? (risk.count / total) * 100 : 0}%` }}
                transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
              />
            </div>
            
            <div className="text-sm text-gray-600 mt-2">
              {total > 0 ? ((risk.count / total) * 100).toFixed(1) : 0}% of total
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RiskBreakdown;