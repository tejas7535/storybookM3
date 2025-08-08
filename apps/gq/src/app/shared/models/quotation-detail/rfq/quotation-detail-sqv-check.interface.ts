import { RecalculationReasons, SqvCheckSource } from '../cost';

export interface QuotationDetailSqvCheck {
  sqvCheckResult: number;
  sqvCheckSource: SqvCheckSource;
  sqvCheckStatus: RecalculationReasons;
  sqvRecalculationValue: number;
}
