// types/index.ts

// Represents a single flagged user or prediction entry
export interface FlaggedUser {
  id: number;
  user: string;
  location: string;
  severity: "High" | "Medium" | "Low";
  score: number;
  timestamp: string;
}

// Represents data for each region
export interface RegionalData {
  region: string;
  count: number;
  severity: "High" | "Medium" | "Low";
  avgScore: number;
}

// Represents the time series data of anomalies
export interface TimeSeriesData {
  time: string; // e.g., "14:00"
  anomalies: number;
}

// Overall analysis results structure
export interface AnalysisResults {
  totalLogins: number;
  anomaliesCount: number;
  severityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  flaggedUsers: FlaggedUser[];
  regionalData: RegionalData[];
  timeSeriesData: TimeSeriesData[];
  summary: string;
}

// Analysis state for UI
export type AnalysisState = "idle" | "uploaded" | "processing" | "completed" | "error";

// For Heatmap component (grid view)
export interface AnomalyData {
  [country: string]: number; // Country name -> anomaly count
}
