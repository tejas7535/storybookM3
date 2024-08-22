import { Customer } from '../customer';
import { OfferType } from '../offer-type.interface';
import { PurchaseOrderType } from '../purchase-order-type.interface';
import { QuotationDetail } from '../quotation-detail';
import { SAP_SYNC_STATUS } from '../quotation-detail/sap-sync-status.enum';
import { SectorGpsd } from '../sector-gpsd.interface';
import { GQUser } from '../user.model';
import { CASE_ORIGIN } from './quotation-origin.enum';
import { QuotationStatus } from './quotation-status.enum';
import { SapCallInProgress } from './sap-call-in-progress.enum';

export class Quotation {
  gqId: number;
  caseName: string;
  reImported: boolean;
  sapId: string;
  gqCreated: string;
  gqCreatedByUser: GQUser;
  gqLastUpdated: string;
  gqLastUpdatedByUser: GQUser;
  sapCreated: string;
  sapLastUpdated: string;
  sapCreatedByUser: GQUser;
  customer: Customer;
  quotationDetails: QuotationDetail[];
  currency: string;
  salesChannel: string;
  division: string;
  requestedDelDate: string;
  validTo: string;
  calculationInProgress: boolean;
  sapCallInProgress: SapCallInProgress;
  status: QuotationStatus;
  sapSyncStatus: SAP_SYNC_STATUS;
  sapQuotationToDate: string;
  // TODO: remove when createManualCaseAsView feature toggle is removed
  sapCustomerPurchaseOrderDate: string;
  sapCustomerInquiryDate: string;
  origin: CASE_ORIGIN;
  shipToParty: Customer;
  purchaseOrderType: PurchaseOrderType;
  partnerRole: SectorGpsd;
  offerType: OfferType;
}
