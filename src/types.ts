export type AnalysisState = 'idle' | 'uploaded' | 'processing' | 'completed' | 'error';

export interface FlaggedUser {
  id: number;
  user: string;
  location: string;
  severity: 'High' | 'Medium' | 'Low';
  score: number;
  timestamp: string;
}

export interface RegionalData {
  region: string;
  count: number;
  severity: string;
}

export interface TimeSeriesData {
  time: string;
  anomalies: number;
}

export interface SeverityBreakdown {
  high: number;
  medium: number;
  low: number;
}

export interface AnalysisResults {
  totalLogins: number;
  anomaliesCount: number;
  severityBreakdown: SeverityBreakdown;
  flaggedUsers: FlaggedUser[];
  regionalData: RegionalData[];
  timeSeriesData: TimeSeriesData[];
  summary: string;
}