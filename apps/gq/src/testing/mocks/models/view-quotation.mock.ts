import { ViewQuotation } from '../../../app/case-view/models/view-quotation.model';

export const VIEW_QUOTATION_MOCK: ViewQuotation = {
  gqId: '1234',
  customerName: 'name',
  customerIdentifiers: { customerId: '1234', salesOrg: '0672' },
  imported: true,
  sapCreated: new Date(),
  sapCreatedByUser: { id: 'userid', name: 'username' },
  sapId: '1234',
  gqCreated: new Date(),
  gqCreatedByUser: { id: 'userid', name: 'username' },
  gqLastUpdatedByUser: { id: 'userid', name: 'username' },
  gqLastUpdated: new Date(),
};
