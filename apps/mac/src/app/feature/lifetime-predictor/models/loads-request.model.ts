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

export interface LoadsNetworkRequest extends LoadOptions {
  loads: number[];
  fatigue_strength1: number;
  fatigue_strength0: number;
}
