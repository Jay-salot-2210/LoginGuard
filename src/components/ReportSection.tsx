import React from 'react';
import { AnalysisResults } from '../types';
import { FileText, Download, Users, AlertTriangle, MapPin, Clock } from 'lucide-react';

interface ReportSectionProps {
  results: AnalysisResults;
}

const ReportSection: React.FC<ReportSectionProps> = ({ results }) => {
  const generateCSVData = () => {
    const headers = ['User', 'Location', 'Severity', 'Risk Score', 'Timestamp'];
    const rows = results.flaggedUsers.map(user => [
      user.user,
      user.location,
      user.severity,
      (user.score * 100).toFixed(1) + '%',
      new Date(user.timestamp).toLocaleString()
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
    link.download = `anomaly-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generatePDFReport = () => {
    // In a real application, you would use a library like jsPDF or html2pdf
    // For this demo, we'll create a formatted text report
    const reportContent = `
ANOMALY DETECTION SECURITY REPORT
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
${results.summary}

KEY FINDINGS
- Total Logins Analyzed: ${results.totalLogins.toLocaleString()}
- Anomalies Detected: ${results.anomaliesCount}
- High Risk Events: ${results.severityBreakdown.high}
- Medium Risk Events: ${results.severityBreakdown.medium}
- Low Risk Events: ${results.severityBreakdown.low}

FLAGGED USERS
${results.flaggedUsers.map(user => 
  `- ${user.user} (${user.location}) - ${user.severity} Risk - Score: ${(user.score * 100).toFixed(1)}%`
).join('\n')}

RECOMMENDATIONS
1. Immediately review high-risk login events
2. Implement additional authentication for suspicious locations
3. Monitor flagged accounts for unusual activity
4. Update security policies based on identified patterns
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `anomaly-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Security <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Report
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Detailed analysis and actionable recommendations for your security team
          </p>
        </div>

        {/* Report Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-teal-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Executive Summary</h3>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {results.summary}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <div className="text-2xl font-bold text-blue-900 mb-1">{results.totalLogins.toLocaleString()}</div>
              <div className="text-sm text-blue-700">Total Logins</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
              <AlertTriangle className="w-8 h-8 text-red-600 mb-3" />
              <div className="text-2xl font-bold text-red-900 mb-1">{results.anomaliesCount}</div>
              <div className="text-sm text-red-700">Anomalies Found</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <MapPin className="w-8 h-8 text-purple-600 mb-3" />
              <div className="text-2xl font-bold text-purple-900 mb-1">{results.regionalData.length}</div>
              <div className="text-sm text-purple-700">Regions Affected</div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-6 border border-teal-100">
              <Clock className="w-8 h-8 text-teal-600 mb-3" />
              <div className="text-2xl font-bold text-teal-900 mb-1">{results.severityBreakdown.high}</div>
              <div className="text-sm text-teal-700">High Priority</div>
            </div>
          </div>
        </div>

        {/* Detailed Findings */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Assessment */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Risk Assessment</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-red-600">High Risk</span>
                  <span className="text-sm text-gray-600">{results.severityBreakdown.high} events</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(results.severityBreakdown.high / results.anomaliesCount) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-yellow-600">Medium Risk</span>
                  <span className="text-sm text-gray-600">{results.severityBreakdown.medium} events</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(results.severityBreakdown.medium / results.anomaliesCount) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-600">Low Risk</span>
                  <span className="text-sm text-gray-600">{results.severityBreakdown.low} events</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(results.severityBreakdown.low / results.anomaliesCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recommendations</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Immediate Action Required</h4>
                  <p className="text-sm text-gray-600">Review all high-risk login events within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Enhanced Authentication</h4>
                  <p className="text-sm text-gray-600">Implement MFA for suspicious geographic locations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Continuous Monitoring</h4>
                  <p className="text-sm text-gray-600">Set up automated alerts for similar patterns</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Policy Updates</h4>
                  <p className="text-sm text-gray-600">Update security policies based on findings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Download Complete Report</h3>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Get the full analysis in your preferred format for sharing with your security team and stakeholders
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={downloadCSV}
              className="px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-gray-50 
                       transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl
                       flex items-center justify-center space-x-3"
            >
              <Download className="w-5 h-5" />
              <span>Download CSV Data</span>
            </button>
            
            <button
              onClick={generatePDFReport}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20
                       hover:bg-white/20 transform hover:scale-105 transition-all duration-300
                       flex items-center justify-center space-x-3"
            >
              <FileText className="w-5 h-5" />
              <span>Download Report (TXT)</span>
            </button>
          </div>

          <p className="text-sm text-teal-200 mt-6">
            Reports include detailed analysis, flagged users, and actionable recommendations
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReportSection;