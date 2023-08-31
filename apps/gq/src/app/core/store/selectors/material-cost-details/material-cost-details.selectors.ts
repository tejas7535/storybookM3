import {
  MaterialCostDetails,
  QuotationDetail,
} from '@gq/shared/models/quotation-detail';
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
  ): boolean =>
    materialCostDetails &&
    (materialCostDetails.gpcYear !== selectedQuotationDetail?.gpcYear ||
      materialCostDetails.gpc !== selectedQuotationDetail?.gpc || // for GPC the year might be the same but the value could differ
      materialCostDetails.sqvDate !== selectedQuotationDetail?.sqvDate)
);
