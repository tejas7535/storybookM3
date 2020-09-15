import { Graph } from '.';

export interface StatisticalPrediction {
  haigh: {
    analytical: {
      r0_fkm: number;
      r0_murakami: number;
      r1_fkm: number;
      r1_murakami: number;
    };
    statistical: {
      r0: number;
      r1: number;
    };
  };
  woehler: {
    analytical: {
      sa_fkm: number;
      sa_murakami: number;
    };
    statistical_sn_curve: {
      percentile_10: Graph;
      percentile_50: Graph;
      percentile_90: Graph;
    };
  };
}
