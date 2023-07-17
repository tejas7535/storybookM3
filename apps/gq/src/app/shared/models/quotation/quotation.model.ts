import { Customer } from '../customer';
import { QuotationDetail } from '../quotation-detail';
import { SAP_SYNC_STATUS } from '../quotation-detail/sap-sync-status.enum';
import { GQUser } from '../user.model';
import { CASE_ORIGIN } from './quotation-origin.enum';
import { QuotationStatus } from './quotation-status.enum';
import { SapCallInProgress } from './sap-call-in-progress.enum';

export class Quotation {
  public gqId: number;
  public caseName: string;
  public reImported: boolean;
  public sapId: string;
  public gqCreated: string;
  public gqCreatedByUser: GQUser;
  public gqLastUpdated: string;
  public gqLastUpdatedByUser: GQUser;
  public sapCreated: string;
  public sapLastUpdated: string;
  public sapCreatedByUser: GQUser;
  public customer: Customer;
  public quotationDetails: QuotationDetail[];
  public currency: string;
  public salesChannel: string;
  public division: string;
  public requestedDelDate: string;
  public validTo: string;
  public calculationInProgress: boolean;
  public sapCallInProgress: SapCallInProgress;
  public status: QuotationStatus;
  public sapSyncStatus: SAP_SYNC_STATUS;
  public sapQuotationToDate: string;
  public sapCustomerPurchaseOrderDate: string;
  public origin: CASE_ORIGIN;
  public shipToParty: Customer;
}
