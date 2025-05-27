import { ShipToParty } from './ship-to-party';

export interface UpdateQuotationRequest {
  caseName?: string;
  currency?: string;
  quotationToDate?: string;
  requestedDelDate?: string;
  customerInquiryDate?: string;
  validTo?: string;
  shipToParty?: ShipToParty;
  purchaseOrderTypeId?: string;
  partnerRoleId?: string;
  offerTypeId?: number;
}
