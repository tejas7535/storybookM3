import { SalesIndication } from './sales-indication.enum';
import { AbcClassification } from '../../../../../shared/models/customer';

export interface ComparableLinkedTransaction {
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
  abcClassification: AbcClassification;
  region: string;
  sectorManagement: string;
}
