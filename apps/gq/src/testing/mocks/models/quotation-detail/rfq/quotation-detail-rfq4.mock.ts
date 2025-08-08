import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { QuotationDetailRfq4 } from '@gq/shared/models/quotation-detail/rfq/quotation-detail-rfq4.interface';

export const QUOTATION_DETAIL_RFQ4: QuotationDetailRfq4 = {
  rfq4Status: Rfq4Status.OPEN,
  sqvApprovalStatus: SqvApprovalStatus.APPROVED,
  message: 'Test message',
  rfq4Id: 123_456,
  allowedToReopen: true,
};
