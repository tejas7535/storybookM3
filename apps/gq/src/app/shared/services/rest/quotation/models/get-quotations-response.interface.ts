import { QuotationStatus, ViewQuotation } from '../../../../models/quotation';

export interface GetQuotationsResponse {
  quotations: ViewQuotation[];
  statusTypeOfListedQuotation: QuotationStatus;
  activeCount: number;
  inApprovalCount: number;
  toApproveCount: number;
  approvedCount: number;
  archivedCount: number;
}
