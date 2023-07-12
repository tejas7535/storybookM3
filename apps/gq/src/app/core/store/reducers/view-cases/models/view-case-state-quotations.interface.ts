import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';

import { ViewCasesStateQuotation } from './view-cases-state-quotation.interface';

export interface ViewCasesStateQuotations {
  displayStatus: QuotationStatus;
  active: ViewCasesStateQuotation;
  archived: ViewCasesStateQuotation;
  toApprove: ViewCasesStateQuotation;
  inApproval: ViewCasesStateQuotation;
  approved: ViewCasesStateQuotation;
}
