import { MaterialCostDetails } from '@gq/shared/models/quotation-detail';
import { createSelector } from '@ngrx/store';

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
