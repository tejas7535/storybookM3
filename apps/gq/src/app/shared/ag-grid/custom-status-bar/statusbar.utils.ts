import { QuotationStatus, SAP_SYNC_STATUS } from '@gq/shared/models';

export function getTooltipTextKeyByQuotationStatus(
  quotationStatus: QuotationStatus,
  selectionLength: number,
  uploadLimit: number,
  quotationSyncStatus?: SAP_SYNC_STATUS
): string {
  if (quotationSyncStatus === SAP_SYNC_STATUS.SYNC_PENDING) {
    return 'disabledForSyncPendingTooltip';
  }

  if (
    quotationStatus === QuotationStatus.DELETED ||
    quotationStatus === QuotationStatus.ARCHIVED
  ) {
    return 'disabledForDeletedCasesTooltip';
  }

  if (quotationStatus === QuotationStatus.ACTIVE) {
    return selectionLength <= uploadLimit
      ? 'uploadQuoteToSapPositionsInfoText'
      : 'uploadQuoteToSapPositionsInfoTextMaxPositions';
  }

  // remaining Statuses are Approval Active Statuses --> In Approval, Rejected, Approved
  return 'disabledForActiveWorkflowTooltip';
}

export function calculateFilteredRows(
  displayedRowCount: number,
  totalRowCount: number
): number {
  return displayedRowCount === totalRowCount ? 0 : displayedRowCount;
}
