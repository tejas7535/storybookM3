import { QuotationStatus } from '../../../app/shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '../../../app/shared/services/rest/quotation/models/get-quotations-response.interface';

export const GET_QUOTATIONS_RESPONSE_MOCK: GetQuotationsResponse = {
  quotations: [],
  activeCount: 0,
  archivedCount: 0,
  inApprovalCount: 0,
  toApproveCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  statusTypeOfListedQuotation: QuotationStatus.ACTIVE,
};
