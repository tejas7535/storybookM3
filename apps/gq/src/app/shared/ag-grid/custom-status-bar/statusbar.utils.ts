import { QuotationStatus } from '@gq/shared/models';

export function getTooltipTextKeyByQuotationStatus(
  quotationStatus: QuotationStatus,
  selectionLength: number,
  uploadLimit: number
): string {
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
