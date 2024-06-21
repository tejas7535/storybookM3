export interface MonthlyFluctuation {
  fluctuationRates: {
    distribution: number[];
    responseModified: boolean;
  };
  unforcedFluctuationRates: {
    distribution: number[];
    responseModified: boolean;
  };
  headcounts: {
    distribution: number[];
    responseModified: boolean;
  };
  unforcedLeavers: {
    distribution: number[];
    responseModified: boolean;
  };
}
