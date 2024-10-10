import { ShipToParty } from './ship-to-party';

export interface UpdateQuotationRequest {
  caseName?: string;
  currency?: string;
  quotationToDate?: string;
  requestedDelDate?: string;
  // TODO: remove when createManualCaseAsView feature toggle is removed see https://jira.schaeffler.com/browse/GQUOTE-5048
  customerPurchaseOrderDate?: string;
  customerInquiryDate?: string;
  validTo?: string;
  shipToParty?: ShipToParty;
  purchaseOrderTypeId?: string;
  partnerRoleId?: string;
  offerTypeId?: number;
}
