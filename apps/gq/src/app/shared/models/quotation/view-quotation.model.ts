import { GQUser } from '..';
import { CustomerId } from '../customer';

export interface ViewQuotation {
  gqId: number;
  caseName: string;
  imported: boolean;
  sapCreated: string;
  sapCreatedByUser: GQUser;
  sapId: string;
  gqCreated: string;
  gqCreatedByUser: GQUser;
  gqLastUpdatedByUser: GQUser;
  gqLastUpdated: string;
  customerIdentifiers: CustomerId;
  customerName: string;
  origin: number;
}
