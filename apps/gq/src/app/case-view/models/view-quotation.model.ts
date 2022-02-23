import { User } from '../../shared/models';
import { CustomerIds } from '../../shared/models/customer';

export interface ViewQuotation {
  gqId: number;
  caseName: string;
  imported: boolean;
  sapCreated: string;
  sapCreatedByUser: User;
  sapId: string;
  gqCreated: string;
  gqCreatedByUser: User;
  gqLastUpdatedByUser: User;
  gqLastUpdated: string;
  customerIdentifiers: CustomerIds;
  customerName: string;
}
