import { User } from '..';
import { CustomerId } from '../customer';

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
  customerIdentifiers: CustomerId;
  customerName: string;
  origin: number;
}
