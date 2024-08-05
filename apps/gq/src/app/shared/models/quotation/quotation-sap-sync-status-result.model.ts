import { SAP_SYNC_STATUS } from '@gq/shared/models';
import { QuotationDetailSapSyncStatus } from '@gq/shared/models/quotation-detail/quotation-detail-sap-sync-status.model';

export interface QuotationSapSyncStatusResult {
  sapSyncStatus: SAP_SYNC_STATUS;
  quotationDetailSapSyncStatusList: QuotationDetailSapSyncStatus[];
}
