import { QuotationDetail } from '@gq/shared/models/quotation-detail/quotation-detail.model';

import { ApprovalProcessAction } from './approval-process-action.enum';

export interface ProcessesModalDialogData {
  process: ApprovalProcessAction;
  title: string;
  quotationDetail: QuotationDetail;
}
