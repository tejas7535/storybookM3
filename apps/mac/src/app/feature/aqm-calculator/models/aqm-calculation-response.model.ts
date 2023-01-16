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
