import { QuotationStatus, SAP_SYNC_STATUS } from '@gq/shared/models';

import { getTooltipTextKeyByQuotationStatus } from './statusbar.utils';

describe('statusbarUtils', () => {
  test('should return disabledForDeletedCasesTooltip', () => {
    const result = getTooltipTextKeyByQuotationStatus(
      QuotationStatus.DELETED,
      1,
      1000
    );
    expect(result).toEqual('disabledForDeletedCasesTooltip');
  });

  test('should return uploadQuoteToSapPositionsInfoText', () => {
    const result = getTooltipTextKeyByQuotationStatus(
      QuotationStatus.ACTIVE,
      1,
      1000
    );
    expect(result).toEqual('uploadQuoteToSapPositionsInfoText');
  });
  test('should return uploadQuoteToSapPositionsInfoTextMaxPositions', () => {
    const result = getTooltipTextKeyByQuotationStatus(
      QuotationStatus.ACTIVE,
      1001,
      1000
    );
    expect(result).toEqual('uploadQuoteToSapPositionsInfoTextMaxPositions');
  });
  test('should return  disabledForActiveWorkflowTooltip', () => {
    const result = getTooltipTextKeyByQuotationStatus(
      QuotationStatus.IN_APPROVAL,
      1001,
      1000
    );
    expect(result).toEqual('disabledForActiveWorkflowTooltip');
  });
  test('should return disabledForSyncPendingTooltip', () => {
    const result = getTooltipTextKeyByQuotationStatus(
      QuotationStatus.ACTIVE,
      1,
      1000,
      SAP_SYNC_STATUS.SYNC_PENDING
    );
    expect(result).toEqual('disabledForSyncPendingTooltip');
  });
});
