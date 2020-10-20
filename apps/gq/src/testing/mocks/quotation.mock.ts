import { Quotation } from '../../app/core/store/models';
import { CUSTOMER_MOCK } from './customer.mock';
import { QUOTATION_DETAIL_MOCK } from './quotation-details.mock';

export const QUOTATION_MOCK: Quotation = {
  quotationNumber: '12345',
  quotationDetails: [QUOTATION_DETAIL_MOCK],
  customer: CUSTOMER_MOCK,
};
