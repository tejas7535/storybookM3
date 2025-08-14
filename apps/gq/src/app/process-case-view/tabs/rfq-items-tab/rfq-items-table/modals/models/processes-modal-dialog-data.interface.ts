import { QuotationDetail } from '@gq/shared/models/quotation-detail/quotation-detail.model';

import { RecalculationProcessAction } from './recalculation-process-action.enum';

export interface ProcessesModalDialogData {
  process: RecalculationProcessAction;
  title: string;
  quotationDetail: QuotationDetail;
}
