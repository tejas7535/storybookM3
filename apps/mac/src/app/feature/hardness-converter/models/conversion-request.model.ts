export interface ConversionRequest {
  conversionTable: string;
  unit: string;
  value: number;
  deviation?: number;
}
