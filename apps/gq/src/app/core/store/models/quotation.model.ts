import { Customer } from './customer.model';
import { QuotationDetail } from './quotation-detail.model';

export class Quotation {
  constructor(
    public quotationNumber: string,
    public customer: Customer,
    public quotationDetails: QuotationDetail[]
  ) {}
}
