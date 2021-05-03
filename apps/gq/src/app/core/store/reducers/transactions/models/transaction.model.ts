import { SalesIndication } from './sales-indication.enum';

export interface Transaction {
  identifier: number;
  customerName: string;
  customerId: string;
  country: string;
  materialDescription: string;
  price: number;
  quantity: number;
  profitMargin: number;
  salesIndication: SalesIndication;
  year: string;
}
