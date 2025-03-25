import { RecalculationReasons } from './recalculation-reasons.enum';
import { SqvApprovalStatus } from './sqv-approval-status.enum';
import { SqvCheckSource } from './sqv-check-source.enum';
import { SqvCheckStatus } from './sqv-check-status.enum';

export class QuotationDetailCosts {
  public sqvCheckResult?: number;
  public sqvCheckSource?: SqvCheckSource;
  public sqvRecalculationReason?: RecalculationReasons;
  public sqvRecalculationValue?: number;
  public sqvCheckStatus?: SqvCheckStatus;
  public sqvApprovalStatus?: SqvApprovalStatus;
}
