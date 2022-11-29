import { createSelector } from '@ngrx/store';

import { MaterialCostDetails } from '../../../../shared/models/quotation-detail';
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
