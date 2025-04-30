import { RecalculationReasons } from './recalculation-reasons.enum';
import { Rfq4Status } from './rfq-4-status.enum';
import { SqvApprovalStatus } from './sqv-approval-status.enum';
import { SqvCheckSource } from './sqv-check-source.enum';

export class QuotationDetailCosts {
  public sqvCheckResult?: number;
  public sqvCheckSource?: SqvCheckSource;
  public sqvCheckStatus?: RecalculationReasons;
  public sqvRecalculationValue?: number;
  public rfq4Status?: Rfq4Status;
  public sqvApprovalStatus?: SqvApprovalStatus;
}
