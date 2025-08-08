import { Rfq4Status } from '../cost';
import { SqvApprovalStatus } from '../cost/sqv-approval-status.enum';

export interface QuotationDetailRfq4 {
  rfq4Status: Rfq4Status;
  sqvApprovalStatus: SqvApprovalStatus;
  message: string;
  rfq4Id: number;
  allowedToReopen: boolean;
}
