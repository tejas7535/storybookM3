import { Customer } from './customer.model';
import { QuotationDetail } from './quotation-detail.model';
import { User } from './user';

export class Quotation {
  constructor(
    public gqId: string,
    public customer: Customer,
    public quotationDetails: QuotationDetail[],
    public id: string,
    public name: string,
    public imported: boolean,
    public sapCreatedByUser: User,
    public gqCreatedByUser: User
  ) {}
}
