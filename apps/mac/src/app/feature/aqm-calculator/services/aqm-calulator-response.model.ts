export interface AQMMaterialsResponse {
  materials: AQMMaterial[];
  sumLimits: AQMSumLimits;
  compositionLimits: AQMCompositionLimits;
}

export interface AQMCalculationResponse {
  aqm: {
    result: number;
    error: string;
  };
  sumValue: number;
  limits: {
    '100Cr6': boolean;
    '100CrMnSi6-4': boolean;
    '100CrMo7-3': boolean;
    '100CrMnMoSi8-4-6': boolean;
    '100CrMo7': boolean;
  };
}

export interface AQMCalculationRequest {
  c: number;
  si: number;
  mn: number;
  cr: number;
  mo: number;
  ni: number;
}

export interface AQMSumLimits {
  '100Cr6': number;
  '100CrMnSi6-4': number;
  '100CrMo7-3': number;
  '100CrMnMoSi8-4-6': number;
  '100CrMo7': number;
}

export interface AQMCompositionLimits {
  c: AQMLimit;
  si: AQMLimit;
  mn: AQMLimit;
  cr: AQMLimit;
  mo: AQMLimit;
  ni: AQMLimit;
}

export interface AQMMaterial {
  name: string;
  c: number;
  si: number;
  mn: number;
  cr: number;
  mo: number;
  ni: number;
}

export interface AQMLimit {
  max: number;
  min: number;
}
