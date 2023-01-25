import { User } from '..';
import { CustomerIds } from '../customer';

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
  origin: number;
}
