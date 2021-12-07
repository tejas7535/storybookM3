import { AbcClassification } from '../../../../../shared/models/customer';
import { SalesIndication } from './sales-indication.enum';

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
  competitor: string;
  relativeCompetitorPrice: string;
}
