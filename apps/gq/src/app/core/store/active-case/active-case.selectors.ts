import {
  Coefficients,
  DetailViewQueryParams,
  Quotation,
  QuotationDetail,
  QuotationStatus,
  SAP_SYNC_STATUS,
  SimulatedQuotation,
} from '@gq/shared/models';
import { QuotationPricingOverview } from '@gq/shared/models/quotation';
import { PriceUnitForQuotationItemId } from '@gq/shared/models/quotation-detail/price-units-for-quotation-item-ids.model';
import { calculateStatusBarValues } from '@gq/shared/utils/pricing.utils';
import { createSelector } from '@ngrx/store';

import { activeCaseFeature, ActiveCaseState } from './active-case.reducer';
import { QuotationIdentifier } from './models';

export const getSelectedQuotationDetail = createSelector(
  activeCaseFeature.selectQuotation,
  activeCaseFeature.selectSelectedQuotationDetail,
  (quotation: Quotation, selectedQuotationDetail: string): QuotationDetail =>
    quotation?.quotationDetails.find(
      (detail: QuotationDetail) =>
        detail.gqPositionId === selectedQuotationDetail
    )
);

export const getQuotationCurrency = createSelector(
  activeCaseFeature.selectQuotation,
  (quotation: Quotation): string => quotation?.currency
);

export const getCoefficients = createSelector(
  getSelectedQuotationDetail,
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

export const getIsQuotationActive = createSelector(
  activeCaseFeature.selectQuotation,
  (quotation: Quotation): boolean =>
    quotation?.status === QuotationStatus.ACTIVE
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

export const getPriceUnitOfSelectedQuotationDetail = createSelector(
  getSelectedQuotationDetail,
  (detail: QuotationDetail): number => detail?.material?.priceUnit
);

export const getPriceUnitsForQuotationItemIds = createSelector(
  getQuotationDetails,
  (quotationDetails: QuotationDetail[]): PriceUnitForQuotationItemId[] =>
    quotationDetails.map((quotationDetail: QuotationDetail) => ({
      quotationItemId: quotationDetail.quotationItemId,
      priceUnit: quotationDetail.material.priceUnit,
    }))
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

export const getDetailViewQueryParams = createSelector(
  activeCaseFeature.selectActiveCaseState,
  (
    state: ActiveCaseState
  ): { queryParams: DetailViewQueryParams; id: number } => ({
    queryParams: {
      customer_number: state.customer?.identifier.customerId,
      sales_org: state.customer?.identifier.salesOrg,
      quotation_number: state.quotation?.gqId,
      gqPositionId: state.selectedQuotationDetail,
    },
    id: state.quotation?.quotationDetails.find(
      (detail) => detail.gqPositionId === state.selectedQuotationDetail
    )?.quotationItemId,
  })
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
      gpi: priceInformation.gpi,
      gpm: priceInformation.gpm,
      netValue: priceInformation.netValue,
      avgGqRating: avgRating,
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

function groupBy<T>(arr: T[], fn: (item: T) => any) {
  const groupedBy = new Map();
  for (const listItem of arr) {
    if (!groupedBy.has(fn(listItem))) {
      groupedBy.set(fn(listItem), [listItem]);
    } else {
      groupedBy.get(fn(listItem)).push(listItem);
    }
  }

  return groupedBy;
}
