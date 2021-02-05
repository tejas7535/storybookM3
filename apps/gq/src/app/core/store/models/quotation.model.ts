import { Customer } from './customer.model';
import { QuotationDetail } from './quotation-detail.model';
import { User } from './user';

export class Quotation {
  public gqId: number;
  public imported: boolean;
  public sapId: string;
  public gqCreated: string;
  public gqCreatedByUser: User;
  public gqLastUpdated: string;
  public gqLastUpdatedByUser: User;
  public sapCreated: string;
  public sapLastUpdated: string;
  public sapCreatedByUser: User;
  public customer: Customer;
  public quotationDetails: QuotationDetail[];
  public currency: string;
  public salesChannel: string;
  public division: string;
  public requestedDelDate: string;
  public validTo: string;
}
