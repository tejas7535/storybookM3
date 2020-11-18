import { Quotation } from '../../app/core/store/models';
import { CUSTOMER_MOCK } from './customer.mock';
import { QUOTATION_DETAIL_MOCK } from './quotation-details.mock';

export const QUOTATION_MOCK: Quotation = {
  gqId: '12345',
  quotationDetails: [QUOTATION_DETAIL_MOCK],
  customer: CUSTOMER_MOCK,
  id: 'ID',
  name: 'Name',
  gqCreatedByUser: { name: 'gqUser', id: 'gqUserId' },
  imported: true,
  sapCreatedByUser: { name: 'sapUser', id: 'sapUserId' },
  sapId: '12345',
};
