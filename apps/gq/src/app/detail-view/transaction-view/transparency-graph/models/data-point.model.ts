import { SalesIndication } from '@gq/core/store/reducers/models';

export class DataPoint {
  salesIndication: SalesIndication;
  value: number[];
  year: string;
  price: number;
  customerName: string;
  customerId: string;
  currency: string;
}
