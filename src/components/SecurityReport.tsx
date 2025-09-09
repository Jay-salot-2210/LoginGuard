import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { AnalysisResults } from '../types';

interface SecurityReportProps {
  results: AnalysisResults;
}

const SecurityReport: React.FC<SecurityReportProps> = ({ results }) => {
  const generateCSVData = () => {
    const headers = ['User', 'Location', 'Severity', 'Risk Score', 'Timestamp'];
    const rows = results.flaggedUsers.map(user => [
      user.user,
      user.location,
      user.severity,
      (user.score * 100).toFixed(1) + '%',
      user.timestamp
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  };

  const downloadCSV = () => {
    const csvData = generateCSVData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateTextReport = () => {
    const reportContent = `
SECURITY ANOMALY DETECTION REPORT
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
${results.summary}

KEY FINDINGS
- Total Logins Analyzed: ${results.totalLogins.toLocaleString()}
- Anomalies Detected: ${results.anomaliesCount}
- High Risk Events: ${results.severityBreakdown.high}
- Medium Risk Events: ${results.severityBreakdown.medium}
- Low Risk Events: ${results.severityBreakdown.low}

REGIONAL ANALYSIS
${results.regionalData.map(region => 
  `- ${region.region}: ${region.count} events (${region.severity} Risk)`
).join('\n')}

FLAGGED USERS
${results.flaggedUsers.map(user => 
  `- ${user.user} (${user.location}) - ${user.severity} Risk - Score: ${(user.score * 100).toFixed(1)}%`
).join('\n')}

RECOMMENDATIONS
1. Immediately review high-risk login events
2. Implement additional authentication for suspicious locations
3. Monitor flagged accounts for unusual activity
4. Update security policies based on identified patterns
5. Consider implementing geo-blocking for high-risk regions
6. Set up automated alerts for similar anomaly patterns

NEXT STEPS
- Schedule security team review within 24 hours
- Update incident response procedures
- Consider additional monitoring tools
- Review and update access control policies
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const recommendations = [
    {
      priority: 'Critical',
      title: 'Immediate Review Required',
      description: 'Review all high-risk login events within 24 hours',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100'
    },
    {
      priority: 'High',
      title: 'Enhanced Authentication',
      description: 'Implement MFA for suspicious geographic locations',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      priority: 'Medium',
      title: 'Continuous Monitoring',
      description: 'Set up automated alerts for similar patterns',
      icon: TrendingUp,
      color: 'from-blue-500 to-teal-500',
      bgColor: 'from-blue-50 to-teal-50'
    },
    {
      priority: 'Low',
      title: 'Policy Updates',
      description: 'Update security policies based on findings',
      icon: CheckCircle,
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-50'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-8"
    >
      {/* Report Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Security Report</h2>
            <p className="text-gray-600">Comprehensive analysis and recommendations</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Executive Summary</h3>
          <p className="text-gray-700 leading-relaxed">{results.summary}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Logins', value: results.totalLogins.toLocaleString(), color: 'blue' },
            { label: 'Anomalies', value: results.anomaliesCount.toString(), color: 'red' },
            { label: 'Regions Affected', value: results.regionalData.length.toString(), color: 'purple' },
            { label: 'High Priority', value: results.severityBreakdown.high.toString(), color: 'orange' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 rounded-xl p-4 text-center border border-${metric.color}-200`}
            >
              <div className={`text-2xl font-bold text-${metric.color}-900 mb-1`}>{metric.value}</div>
              <div className={`text-sm text-${metric.color}-700`}>{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Security Recommendations</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`bg-gradient-to-br ${rec.bgColor} rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${rec.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <rec.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-bold text-gray-900">{rec.title}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      rec.priority === 'Critical' ? 'bg-red-200 text-red-800' :
                      rec.priority === 'High' ? 'bg-orange-200 text-orange-800' :
                      rec.priority === 'Medium' ? 'bg-blue-200 text-blue-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{rec.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Download Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-8 text-center text-white shadow-xl"
      >
        <h3 className="text-2xl font-bold mb-4">Download Complete Report</h3>
        <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
          Get the full security analysis in your preferred format for sharing with stakeholders and security teams
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadCSV}
            className="px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-gray-50 
                     transition-all duration-300 shadow-lg hover:shadow-xl
                     flex items-center justify-center space-x-3"
          >
            <Download className="w-5 h-5" />
            <span>Download CSV Data</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateTextReport}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20
                     hover:bg-white/20 transition-all duration-300
                     flex items-center justify-center space-x-3"
          >
            <FileText className="w-5 h-5" />
            <span>Download Full Report</span>
          </motion.button>
        </div>

        <p className="text-sm text-teal-200 mt-6">
          Reports include detailed analysis, flagged users, regional data, and actionable security recommendations
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SecurityReport;