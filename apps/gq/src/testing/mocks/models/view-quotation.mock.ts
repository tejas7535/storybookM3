import { ViewQuotation } from '../../../app/case-view/models/view-quotation.model';
import { CUSTOMER_MOCK } from './customer.mock';

export const VIEW_QUOTATION_MOCK: ViewQuotation = {
  gqId: '1234',
  customer: CUSTOMER_MOCK,
  name: 'name',
  imported: true,
  sapCreated: new Date(),
  sapCreatedByUser: { id: 'userid', name: 'username' },
  sapId: '1234',
  gqCreated: new Date(),
  gqCreatedByUser: { id: 'userid', name: 'username' },
  gqLastUpdatedByUser: { id: 'userid', name: 'username' },
  gqLastUpdated: new Date(),
};
