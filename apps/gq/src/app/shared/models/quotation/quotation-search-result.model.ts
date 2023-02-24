import { QuotationStatus } from './quotation-status.enum';

export class QuotationSearchResult {
  gqId: number;
  customerName: string;
  customerId: string;
  customerSalesOrg: string;
  currency: string;
  materialNumber: string;
  materialPrice: number;
  materialQuantity: number;
  materialGpc: number;
  status: QuotationStatus;
}
