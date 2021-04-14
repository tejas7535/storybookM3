import { KpiParsedHaigh, KpiParsedWoehler, Limits } from '.';

export interface PredictionResultParsed {
  data: Object[];
  lines: Object[];
  limits: Limits;
  kpi: KpiParsedHaigh | KpiParsedWoehler;
}
