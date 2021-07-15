import { KpiParsedHaigh, KpiParsedWoehler, Limits } from '.';

export interface PredictionResultParsed {
  data: any[];
  lines: any[];
  limits: Limits;
  kpi: KpiParsedHaigh | KpiParsedWoehler;
}
