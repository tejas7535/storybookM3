import { SalesIndication } from '../../../app/core/store/transactions/models/sales-indication.enum';
import { DataPoint } from '../../../app/detail-view/transaction-view/transparency-graph/models/data-point.model';

export const DATA_POINT_MOCK: DataPoint = {
  currency: 'EUR',
  salesIndication: SalesIndication.LOST_QUOTE,
  value: [120, 120],
  year: '2019',
  price: 25,
  gpi: 120,
  customerName: 'Daimler',
  customerId: '1234',
};
