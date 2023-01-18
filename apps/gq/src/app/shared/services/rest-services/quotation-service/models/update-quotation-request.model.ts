export interface UpdateQuotationRequest {
  caseName: string;
  currency: string;
  quotationToDate: string;
  requestedDelDate: string;
  customerPurchaseOrderDate: string;
  validTo: string;
}
