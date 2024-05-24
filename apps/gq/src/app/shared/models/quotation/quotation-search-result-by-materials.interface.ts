import { GqCreatedByUser } from './gq-created-by-user.interface';
import { QuotationStatus } from './quotation-status.enum';

export interface QuotationSearchResultByMaterialsResponse {
  results: QuotationSearchResultByMaterials[];
}
export interface QuotationSearchResultByMaterials {
  gqId: number;
  customerName: string;
  customerId: string;
  salesOrg: string;
  enabledForApprovalWorkflow: boolean;
  status: QuotationStatus;
  gqCreatedByUser: GqCreatedByUser;
  gqCreated: string;
  gqLastUpdated: string;
  materialNumber15: string;
  materialDescription: string;
  customerMaterial: string;
  quantity: number;
  price: number;
  currency: string;
  gpi: number;
}
