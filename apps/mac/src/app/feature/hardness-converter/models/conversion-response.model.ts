export interface ConversionResponse {
  converted: {
    unit: string;
    value?: number;
    warning?: string;
  }[];
  deviationWarning?: boolean;
  error?: string;
}
