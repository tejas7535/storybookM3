import { KpiParsedHaigh, KpiParsedWoehler } from '.';

export interface PredictionResultParsed {
  data: Object[];
  lines: Object[];
  limits: Object;
  kpi: KpiParsedHaigh | KpiParsedWoehler;
}
