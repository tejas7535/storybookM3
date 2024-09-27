import { SalesIndication } from '@gq/core/store/reducers/models';

export class DataPoint {
  salesIndication: SalesIndication;
  value: number[];
  year: string;
  price: number;
  gpi: number;
  customerName: string;
  customerId: string;
  currency: string;
}
