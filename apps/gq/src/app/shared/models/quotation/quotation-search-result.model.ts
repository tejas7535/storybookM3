import { QuotationStatus } from './quotation-status.enum';

export class QuotationSearchResult {
  gqId: number;
  customerName: string;
  customerNumber: string;
  salesOrg: string;
  customerCurrency: string;
  priceOfMaterial: number;
  quantityOfMaterial: number;
  gpi: number;
  status: QuotationStatus;
}
