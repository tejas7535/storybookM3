import {
  QuotationSearchResult,
  QuotationStatus,
} from '../../../app/shared/models/quotation';

export const QUOTATION_SEARCH_RESULT_MOCK: QuotationSearchResult = {
  gqId: 46_061,
  customerName: 'customerName',
  customerId: '12345',
  customerSalesOrg: '0615',
  materialNumber: '123456',
  materialGpc: 24.5,
  materialPrice: 13.4,
  materialQuantity: 10,
  status: QuotationStatus.ACTIVE,
  currency: 'EUR',
};
