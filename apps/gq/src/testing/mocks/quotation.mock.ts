import { Quotation } from '../../app/core/store/models';
import { CUSTOMER_MOCK } from './customer.mock';
import { QUOTATION_DETAIL_MOCK } from './quotation-details.mock';

export const QUOTATION_MOCK: Quotation = {
  gqId: 12345,
  quotationDetails: [QUOTATION_DETAIL_MOCK],
  customer: CUSTOMER_MOCK,
  id: 'ID',
  name: 'Name',
  gqCreatedByUser: { name: 'gqUser', id: 'gqUserId' },
  imported: true,
  sapCreatedByUser: { name: 'sapUser', id: 'sapUserId' },
  sapId: '12345',
  gqCreated: '2020-12-17T09:29:34',
  gqLastUpdated: '2020-12-17T09:29:34',
  gqLastUpdatedByUser: { id: '1', name: 'eins' },
  sapCreated: '2020-04-21T00:00:00',
  sapLastUpdated: '2020-05-07T00:00:00',
};
