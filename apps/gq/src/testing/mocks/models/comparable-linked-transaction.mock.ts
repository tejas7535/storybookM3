import { ComparableLinkedTransaction } from '../../../app/core/store/reducers/transactions/models/comparable-linked-transaction.model';
import { SalesIndication } from '../../../app/core/store/reducers/transactions/models/sales-indication.enum';
import { AbcClassification } from '../../../app/shared/models/customer';

export const COMPARABLE_LINKED_TRANSACTION_MOCK: ComparableLinkedTransaction = {
  identifier: 213,
  customerName: 'customerName',
  customerId: 'customerId',
  country: 'DE',
  materialDescription: 'matDesc',
  price: 10,
  profitMargin: 0.5,
  quantity: 100,
  salesIndication: SalesIndication.INVOICE,
  year: '2020',
  abcClassification: AbcClassification.A,
  region: 'EU',
  sectorManagement: 'PT',
  competitor: 'competitor',
  relativeCompetitorPrice: 'relative competitor price',
};
