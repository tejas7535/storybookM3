import { QuotationStatus } from '../../../../../shared/models/quotation/quotation-status.enum';
import { ViewCasesStateQuotation } from './view-cases-state-quotation.interface';

export interface ViewCasesStateQuotations {
  displayStatus: QuotationStatus;
  active: ViewCasesStateQuotation;
  inactive: ViewCasesStateQuotation;
}
