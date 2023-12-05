import {
  MaterialCostDetails,
  QuotationDetail,
} from '@gq/shared/models/quotation-detail';
import { getPriceUnit, roundValue } from '@gq/shared/utils/pricing.utils';
import { createSelector } from '@ngrx/store';

import { getSelectedQuotationDetail } from '../../active-case/active-case.selectors';
import { getMaterialCostDetailsState } from '../../reducers';
import { MaterialCostDetailsState } from '../../reducers/material-cost-details/material-cost-details.reducer';

export const getMaterialCostDetails = createSelector(
  getMaterialCostDetailsState,
  (state: MaterialCostDetailsState): MaterialCostDetails =>
    state.materialCostDetails
);

export const getMaterialCostDetailsLoading = createSelector(
  getMaterialCostDetailsState,
  (state: MaterialCostDetailsState): boolean => state.materialCostDetailsLoading
);

export const getMaterialCostUpdateAvl = createSelector(
  getMaterialCostDetails,
  getSelectedQuotationDetail,
  (
    materialCostDetails: MaterialCostDetails,
    selectedQuotationDetail: QuotationDetail
  ): boolean => {
    if (!selectedQuotationDetail || !materialCostDetails) {
      return false;
    }

    const roundedMaterialCostGpc = materialCostDetails?.gpc
      ? roundValue(
          materialCostDetails.gpc,
          getPriceUnit(selectedQuotationDetail)
        )
      : undefined;
    const isGpcDifferent =
      roundedMaterialCostGpc !== selectedQuotationDetail?.gpc;

    const isGpcDateDifferent =
      materialCostDetails?.gpcDate !== selectedQuotationDetail?.gpcDate;

    const sqvDateDifferent =
      materialCostDetails?.sqvDate !== selectedQuotationDetail?.sqvDate;

    return (
      isGpcDateDifferent ||
      isGpcDifferent || // for GPC the year might be the same but the value could differ -> value is rounded
      sqvDateDifferent
    );
  }
);
