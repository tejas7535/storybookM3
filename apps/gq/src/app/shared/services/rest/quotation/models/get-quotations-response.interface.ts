import { QuotationStatus, ViewQuotation } from '../../../../models/quotation';

export interface GetQuotationsResponse {
  quotations: ViewQuotation[];
  statusTypeOfListedQuotation: QuotationStatus;
  activeCount: number;
  inApprovalCount: number;
  approvedCount: number;
  archivedCount: number;
}
