import { GQUser, QuotationStatus } from '..';
import { CustomerId } from '../customer';

export interface ViewQuotation {
  gqId: number;
  caseName: string;
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
  status: QuotationStatus;
  statusVerified: boolean;
}
