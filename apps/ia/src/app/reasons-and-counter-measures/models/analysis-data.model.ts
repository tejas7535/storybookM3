export interface AnalysisData {
  reasonId?: number;
  title?: string;
  question?: string;
  impacts?: { title?: string; description: string }[];
  quotes?: string[];
  fullWidth?: boolean;
  show?: boolean;
  loading?: boolean;
}
