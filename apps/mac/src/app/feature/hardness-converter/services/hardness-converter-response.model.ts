export interface HardnessUnitsResponse {
  units: string[];
  version: string;
}

export interface HardnessConversionSingleUnit {
  unit: string;
  value?: number;
  warning?: string;
}

export interface HardnessConversionResponse {
  converted: HardnessConversionSingleUnit[];
  error?: string;
}
