import { Graph } from '.';

export interface StatisticalPredictionParsed {
  woehler: {
    analytical: {
      fkm: Graph;
      murakami: Graph;
    };
    statistical_sn_curve: {
      percentile_50: Graph;
      percentile_10: Graph;
      percentile_90: Graph;
    };
  };
  haigh: {
    analytical: {
      fkm: Graph;
      murakami: Graph;
    };
    statistical: Graph;
  };
}
