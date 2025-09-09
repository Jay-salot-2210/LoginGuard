import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { AnalysisResults } from '../types';

interface AnalysisSummaryProps {
  results: AnalysisResults;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ results }) => {
  const cards = [
    {
      title: 'Total Logins',
      value: results.totalLogins.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Anomalies Detected',
      value: results.anomaliesCount.toString(),
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-50 to-orange-50'
    },
    {
      title: 'Security Score',
      value: `${((results.totalLogins - results.anomaliesCount) / results.totalLogins * 100).toFixed(1)}%`,
      icon: Shield,
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-50'
    },
    {
      title: 'High Risk Events',
      value: results.severityBreakdown.high.toString(),
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0, rotateX: -15 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              transition: { type: "spring", stiffness: 300 }
            }}
            className={`bg-gradient-to-br ${card.bgColor} rounded-2xl p-6 shadow-lg border border-white/50 
                       backdrop-blur-sm hover:shadow-xl transition-all duration-300 perspective-1000`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm text-gray-600">{card.title}</div>
              </div>
            </div>
            
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${card.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: index * 0.2, duration: 1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AnalysisSummary;