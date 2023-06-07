import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';

import { OverviewCasesStateQuotation } from './overview-cases-state-quotation.model';

export interface OverviewCasesStateQuotations {
  displayStatus: QuotationStatus;
  active: OverviewCasesStateQuotation;
  archived: OverviewCasesStateQuotation;
  toBeApproved: OverviewCasesStateQuotation;
  inApproval: OverviewCasesStateQuotation;
  approved: OverviewCasesStateQuotation;
}
