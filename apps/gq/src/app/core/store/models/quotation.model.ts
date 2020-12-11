import { Customer } from './customer.model';
import { QuotationDetail } from './quotation-detail.model';
import { User } from './user';

export class Quotation {
  public gqId: number;
  public customer: Customer;
  public quotationDetails: QuotationDetail[];
  public id: string;
  public name: string;
  public imported: boolean;
  public sapCreatedByUser: User;
  public sapId: string;
  public gqCreatedByUser: User;
}
