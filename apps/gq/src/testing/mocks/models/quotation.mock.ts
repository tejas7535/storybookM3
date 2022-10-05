import { Quotation } from '../../../app/shared/models';
import { QuotationStatus } from '../../../app/shared/models/quotation/quotation-status.enum';
import { CUSTOMER_MOCK } from './customer.mock';
import { QUOTATION_DETAIL_MOCK } from './quotation-details.mock';

export const QUOTATION_MOCK: Quotation = {
  gqId: 12_345,
  caseName: 'caseName',
  imported: true,
  reImported: false,
  sapId: '12345',
  gqCreated: '2020-12-17T09:29:34',
  gqCreatedByUser: { name: 'gqUser', id: 'gqUserId' },
  gqLastUpdated: '2020-12-17T09:29:34',
  gqLastUpdatedByUser: { id: '1', name: 'eins' },
  sapCreated: '2020-04-21T00:00:00',
  sapLastUpdated: '2020-04-21T00:00:00',
  sapCreatedByUser: { name: 'sapUser', id: 'sapUserId' },
  customer: CUSTOMER_MOCK,
  quotationDetails: [QUOTATION_DETAIL_MOCK],
  currency: 'EUR',
  salesChannel: '1',
  division: '2',
  requestedDelDate: '2021-04-21T00:00:00',
  validTo: '2021-03-21T00:00:00',
  calculationInProgress: false,
  sapCallInProgress: false,
  statusTypeOfListedQuotation: QuotationStatus[
    QuotationStatus.ACTIVE
  ] as keyof typeof QuotationStatus,
};
