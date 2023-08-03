import { QuotationTab } from '../models/quotation-tab.enum';
import { OverviewCasesStateQuotation } from './overview-cases-state-quotation.model';

export interface OverviewCasesStateQuotations {
  activeTab: QuotationTab;
  active: OverviewCasesStateQuotation;
  archived: OverviewCasesStateQuotation;
  toApprove: OverviewCasesStateQuotation;
  inApproval: OverviewCasesStateQuotation;
  approved: OverviewCasesStateQuotation;
  rejected: OverviewCasesStateQuotation;
}
