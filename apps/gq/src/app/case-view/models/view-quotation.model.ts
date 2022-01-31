import { User } from '../../shared/models';
import { CustomerIds } from '../../shared/models/customer';

export class ViewQuotation {
  public gqId: string;
  public imported: boolean;
  public sapCreated: Date;
  public sapCreatedByUser: User;
  public sapId: string;
  public gqCreated: Date;
  public gqCreatedByUser: User;
  public gqLastUpdatedByUser: User;
  public gqLastUpdated: Date;
  public customerIdentifiers: CustomerIds;
  public customerName: string;
}
