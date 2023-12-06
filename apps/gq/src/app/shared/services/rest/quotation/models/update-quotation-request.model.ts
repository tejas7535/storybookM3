import { ShipToParty } from './ship-to-party';

export interface UpdateQuotationRequest {
  caseName?: string;
  currency?: string;
  quotationToDate?: string;
  requestedDelDate?: string;
  customerPurchaseOrderDate?: string;
  validTo?: string;
  shipToParty?: ShipToParty;
  // TODO: insert when implemented with GQUOTE-3316
  // purchaseOrderType?: string;
}
