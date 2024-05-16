import { QuotationStatus } from './quotation-status.enum';

export interface QuotationSearchByCasesResponse {
  results: QuotationSearchResultByCases[];
}
export interface QuotationSearchResultByCases {
  gqId: number;
  sapId: number;
  customerName: string;
  customerId: string;
  salesOrg: string;
  enabledForApprovalWorkflow: boolean;
  status: QuotationStatus;
  gqCreatedByUser: GqCreatedByUser;
  gqCreated: string;
  gqLastUpdated: string;
  totalNetValue: number;
  currency: string;
}

export interface GqCreatedByUser {
  name: string;
  id: string;
}
