import { SAP_SYNC_STATUS } from './sap-sync-status.enum';

export interface QuotationDetailSapSyncStatus {
  gqPositionId: string;
  sapSyncStatus: SAP_SYNC_STATUS;
}
