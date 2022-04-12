import { SalesIndication } from '../../../../core/store/reducers/transactions/models/sales-indication.enum';

export class DataPoint {
  salesIndication: SalesIndication;
  value: number[];
  year: string;
  price: number;
  customerName: string;
  customerId: string;
  currency: string;
}
