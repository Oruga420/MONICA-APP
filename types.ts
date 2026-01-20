export interface StudentScore {
  id: number;
  score: number;
}

export interface DistributionRange {
  name: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
  color: string;
}

export interface AnalysisState {
  loading: boolean;
  text: string | null;
  error: string | null;
}
