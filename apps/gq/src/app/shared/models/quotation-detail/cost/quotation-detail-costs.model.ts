import { RecalculationReasons } from './recalculation-reasons.enum';
import { SqvCheckSource } from './sqv-check-source.enum';

export class QuotationDetailCosts {
  public sqvCheckResult?: number;
  public sqvCheckSource?: SqvCheckSource;
  public sqvRecalculationReason?: RecalculationReasons;
  public sqvRecalculationValue?: number;
}
