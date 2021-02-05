import { Customer } from './customer.model';
import { User } from './user';

export class ViewQuotation {
  public gqId: string;
  public customer: Customer;
  public name: string;
  public imported: boolean;
  public sapCreated: Date;
  public sapCreatedByUser: User;
  public sapId: string;
  public status?: string;
  public synchronized?: string;
  public gqCreated: Date;
  public gqCreatedByUser: User;
  public gqLastUpdatedByUser: User;
  public gqLastUpdated: Date;
}
