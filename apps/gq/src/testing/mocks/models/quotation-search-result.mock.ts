import {
  QuotationSearchResult,
  QuotationStatus,
} from '../../../app/shared/models/quotation';

export const QUOTATION_SEARCH_RESULT_MOCK: QuotationSearchResult = {
  gqId: 46_061,
  customerName: 'customerName',
  customerNumber: '12345',
  salesOrg: '0615',
  gpi: 24.5,
  priceOfMaterial: 13.4,
  quantityOfMaterial: 10,
  status: QuotationStatus.ACTIVE,
  customerCurrency: 'EUR',
};
