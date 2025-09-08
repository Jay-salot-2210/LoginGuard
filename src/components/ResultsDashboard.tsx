import React, { useState } from 'react';
import { AnalysisResults } from '../types';
import { Users, AlertTriangle, Shield, MapPin, TrendingUp, ArrowUpRight, ArrowDownRight, Filter, Search } from 'lucide-react';

interface ResultsDashboardProps {
  results: AnalysisResults;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results }) => {
  const [sortField, setSortField] = useState<'score' | 'timestamp' | 'user'>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: 'score' | 'timestamp' | 'user') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedUsers = results.flaggedUsers
    .filter(user => {
      const matchesSeverity = filterSeverity === 'all' || user.severity.toLowerCase() === filterSeverity.toLowerCase();
      const matchesSearch = user.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSeverity && matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'user':
          aValue = a.user.toLowerCase();
          bValue = b.user.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <section id="results" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Analysis <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Results
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Comprehensive security analysis with actionable insights
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{results.totalLogins.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Logins Analyzed</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{results.anomaliesCount}</div>
            <div className="text-sm text-gray-600">Anomalies Detected</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <ArrowDownRight className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {((results.totalLogins - results.anomaliesCount) / results.totalLogins * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Security Score</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{results.severityBreakdown.high}</div>
            <div className="text-sm text-gray-600">High Risk Events</div>
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Risk Severity Breakdown</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{results.severityBreakdown.high}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">High Risk</h4>
              <p className="text-sm text-gray-600">Immediate attention required</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{results.severityBreakdown.medium}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Medium Risk</h4>
              <p className="text-sm text-gray-600">Monitor closely</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{results.severityBreakdown.low}</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Low Risk</h4>
              <p className="text-sm text-gray-600">Routine monitoring</p>
            </div>
          </div>
        </div>

        {/* Regional Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 text-teal-600 mr-2" />
              Regional Anomalies
            </h3>
            <div className="space-y-4">
              {results.regionalData.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      region.severity === 'High' ? 'bg-red-500' :
                      region.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <span className="font-medium text-gray-900">{region.region}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{region.count}</div>
                    <div className="text-sm text-gray-600">{region.severity} Risk</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
              Anomaly Timeline
            </h3>
            <div className="space-y-4">
              {results.timeSeriesData.map((dataPoint, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">{dataPoint.time}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(dataPoint.anomalies / 15) * 100}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900 w-8">{dataPoint.anomalies}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flagged Users Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <h3 className="text-2xl font-bold text-gray-900">Flagged Users</h3>
              
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('user')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>User</span>
                      {sortField === 'user' && (
                        <div className="text-teal-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Risk Score</span>
                      {sortField === 'score' && (
                        <div className="text-teal-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </div>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Timestamp</span>
                      {sortField === 'timestamp' && (
                        <div className="text-teal-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </div>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(user.severity)}`}>
                        {user.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{(user.score * 100).toFixed(1)}%</div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              user.score > 0.8 ? 'bg-red-500' :
                              user.score > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${user.score * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatTimestamp(user.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResultsDashboard;