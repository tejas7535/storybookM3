import { QuotationStatus } from '../../../app/shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '../../../app/shared/services/rest-services/quotation-service/models/get-quotations-response.interface';

export const GET_QUOTATIONS_RESPONSE_MOCK: GetQuotationsResponse = {
  quotations: [],
  activeCount: 0,
  inactiveCount: 0,
  statusTypeOfListedQuotation: QuotationStatus[QuotationStatus.ACTIVE],
};
