import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';
import { AnalysisResults } from '../types';

interface TimelineChartProps {
  results: AnalysisResults;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ results }) => {
  const maxAnomalies = Math.max(...results.timeSeriesData.map(d => d.anomalies), 1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Anomaly Timeline</h3>
      </div>

      <div className="space-y-4">
        {results.timeSeriesData.length > 0 ? (
          results.timeSeriesData.map((dataPoint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-teal-50 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">{dataPoint.time}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{dataPoint.time}</div>
                  <div className="text-sm text-gray-600">{dataPoint.anomalies} anomalies detected</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(dataPoint.anomalies / maxAnomalies) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                  />
                </div>
                <div className="text-2xl font-bold text-gray-900 min-w-[3rem] text-right">
                  {dataPoint.anomalies}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No timeline data available</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">
            {results.timeSeriesData.reduce((sum, d) => sum + d.anomalies, 0)}
          </div>
          <div className="text-sm text-blue-700">Total Anomalies</div>
        </div>
        <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-teal-900">
            {results.timeSeriesData.length}
          </div>
          <div className="text-sm text-teal-700">Time Periods</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineChart;