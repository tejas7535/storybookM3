import { Graph, Kpi } from '.';

export interface PredictionResult {
  woehler: {
    snCurve: Graph;
    appliedStress: Graph;
    percentile1: Graph;
    percentile10: Graph;
    percentile90: Graph;
    percentile99: Graph;
  };
  haigh: {
    snCurve: Graph;
    appliedStress: Graph;
  };
  kpi: Kpi;
}
