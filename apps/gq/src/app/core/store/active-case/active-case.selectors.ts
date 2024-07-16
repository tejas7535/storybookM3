import { AppRoutePath } from '@gq/app-route-path.enum';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import { Tab } from '@gq/shared/components/tabs-header/tab.model';
import {
  Coefficients,
  Quotation,
  QuotationDetail,
  QuotationStatus,
  SAP_SYNC_STATUS,
  SimulatedQuotation,
} from '@gq/shared/models';
import { QuotationPricingOverview } from '@gq/shared/models/quotation';
import { isFNumber } from '@gq/shared/utils/f-pricing.utils';
import { groupBy } from '@gq/shared/utils/misc.utils';
import { calculateStatusBarValues } from '@gq/shared/utils/pricing.utils';
import { createSelector } from '@ngrx/store';

import { activeCaseFeature } from './active-case.reducer';
import { QuotationIdentifier } from './models';

export const getQuotationCurrency = createSelector(
  activeCaseFeature.selectQuotation,
  (quotation: Quotation): string => quotation?.currency
);

export const getCoefficients = createSelector(
  activeCaseFeature.getSelectedQuotationDetail,
  (detail: QuotationDetail): Coefficients => ({
    coefficient1: detail?.coefficient1,
    coefficient2: detail?.coefficient2,
  })
);

export const getIsQuotationStatusActive = createSelector(
  activeCaseFeature.selectQuotation,
  (quotation: Quotation): boolean =>
    quotation?.status === QuotationStatus.ACTIVE
);

export const getQuotationStatus = createSelector(
  activeCaseFeature.selectQuotation,
  (quotation: Quotation): QuotationStatus => quotation?.status
);

export const getSimulatedQuotationDetailByItemId = (itemId: number) =>
  createSelector(
    activeCaseFeature.selectSimulatedItem,
    (simulatedItem: SimulatedQuotation): QuotationDetail | undefined =>
      simulatedItem?.quotationDetails.find(
        (detail: QuotationDetail) => detail.quotationItemId === itemId
      )
  );

export const getSimulationModeEnabled = createSelector(
  activeCaseFeature.selectSimulatedItem,
  (simulatedItem: SimulatedQuotation): boolean =>
    simulatedItem?.quotationDetails !== undefined &&
    simulatedItem?.quotationDetails.length > 0
);

export const getQuotationSapSyncStatus = createSelector(
  activeCaseFeature.selectQuotation,
  (quotation: Quotation): SAP_SYNC_STATUS =>
    quotation?.sapSyncStatus || SAP_SYNC_STATUS.NOT_SYNCED
);

export const getSapId = createSelector(
  activeCaseFeature.selectQuotation,
  (quotation: Quotation): string => quotation?.sapId
);

export const getQuotationDetails = createSelector(
  activeCaseFeature.selectQuotation,
  (quotation: Quotation): QuotationDetail[] => quotation?.quotationDetails
);

export const getGqId = createSelector(
  activeCaseFeature.selectQuotationIdentifier,
  (quotationIdentifier: QuotationIdentifier): number =>
    quotationIdentifier?.gqId
);

export const isManualCase = createSelector(
  activeCaseFeature.selectQuotation,
  (quotation: Quotation): boolean => !quotation?.sapId
);

export const getQuotationOverviewInformation = createSelector(
  getQuotationDetails,
  (details: QuotationDetail[]): QuotationPricingOverview => {
    const priceInformation = calculateStatusBarValues(details);
    const avgRatingItems = details
      .filter((item: QuotationDetail) => !!item && item.gqRating)
      .map((item: QuotationDetail) => item.gqRating);
    const avgRating = Math.round(
      avgRatingItems.reduce((sum: number, x: number) => sum + x, 0) /
        avgRatingItems.length
    );

    return {
      gpi: { value: priceInformation.gpi },
      gpm: { value: priceInformation.gpm },
      netValue: { value: priceInformation.netValue },
      avgGqRating: { value: avgRating },
      deviation: { value: priceInformation.priceDiff },
    };
  }
);

export const getQuotationDetailsByGPSD = createSelector(
  getQuotationDetails,
  (details: QuotationDetail[]): Map<string, QuotationDetail[]> => {
    const groupedBy: Map<string, QuotationDetail[]> = groupBy(
      details,
      (detail) => detail.material.gpsdGroupId
    );

    return groupedBy;
  }
);

export const getQuotationDetailsByPL = createSelector(
  getQuotationDetails,
  (details: QuotationDetail[]): Map<string, QuotationDetail[]> => {
    const groupedBy: Map<string, QuotationDetail[]> = groupBy(
      details,
      (detail) => detail.material.productLineId
    );

    return groupedBy;
  }
);

export const getTabsForProcessCaseView = () =>
  createSelector(
    activeCaseFeature.selectQuotation,
    (quotation: Quotation): Tab[] => {
      const tabs: Tab[] = [];

      if (quotation?.customer?.enabledForApprovalWorkflow) {
        tabs.push({
          label: 'processCaseView.tabs.overview.title',
          link: ProcessCaseRoutePath.OverviewPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
        });
      }
      tabs.push(
        {
          label: 'processCaseView.tabs.singleQuotes.title',
          link: ProcessCaseRoutePath.SingleQuotesPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
        },
        {
          label: 'processCaseView.tabs.customerDetails.title',
          link: ProcessCaseRoutePath.CustomerDetailsPath,
          parentPath: AppRoutePath.ProcessCaseViewPath,
        }
      );

      return tabs;
    }
  );

export const getQuotationHasFNumberMaterials = createSelector(
  getQuotationDetails,
  (details: QuotationDetail[]): boolean =>
    details?.some((singleDetail) => isFNumber(singleDetail))
);

export const getQuotationDetailIsFNumber = createSelector(
  activeCaseFeature.getSelectedQuotationDetail,
  (detail: QuotationDetail): boolean => isFNumber(detail)
);

export const getQuotationHasRfqMaterials = createSelector(
  getQuotationDetails,
  (details: QuotationDetail[]): boolean =>
    details?.some((singleDetail) => !!singleDetail.rfqData?.rfqId) ?? false
);
