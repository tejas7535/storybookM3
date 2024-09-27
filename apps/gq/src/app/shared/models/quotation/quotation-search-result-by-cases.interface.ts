import { GqCreatedByUser } from './gq-created-by-user.interface';
import { QuotationStatus } from './quotation-status.enum';

export interface QuotationSearchByCasesResponse {
  results: QuotationSearchResultByCases[];
}
export interface QuotationSearchResultByCases {
  gqId: number;
  sapId: number;
  caseName: string;
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
