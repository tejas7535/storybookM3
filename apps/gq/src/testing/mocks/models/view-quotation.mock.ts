import { CASE_ORIGIN, QuotationStatus } from '../../../app/shared/models';
import { ViewQuotation } from '../../../app/shared/models/quotation';

export const VIEW_QUOTATION_MOCK: ViewQuotation = {
  gqId: 1234,
  caseName: 'caseName',
  customerName: 'name',
  customerIdentifiers: { customerId: '1234', salesOrg: '0672' },
  sapCreated: '2022-02-21T09:14:17.2994738+01:00',
  sapCreatedByUser: { id: 'userid', name: 'username' },
  sapId: '1234',
  gqCreated: '2022-02-21T09:14:17.2994738+01:00',
  gqCreatedByUser: { id: 'userid', name: 'username' },
  gqLastUpdatedByUser: { id: 'userid', name: 'username' },
  gqLastUpdated: '2022-02-21T09:14:17.2994738+01:00',
  origin: CASE_ORIGIN.CREATED_MANUALLY,
  status: QuotationStatus.ACTIVE,
};
