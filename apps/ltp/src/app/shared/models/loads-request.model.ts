export interface LoadOptions {
  conversionFactor: number;
  repetitionFactor: number;
  method: string;
}

export interface LoadsRequest extends LoadOptions {
  status: number;
  data: number[];
  error?: string;
}
