import { createSelector } from '@ngrx/store';

import { MaterialComparableCost } from '../../../../shared/models/quotation-detail/material-comparable-cost.model';
import { getMaterialComparableCostsState } from '../../reducers';
import { MaterialComparableCostsState } from '../../reducers/material-comparable-costs/material-comparable-costs.reducer';

export const getMaterialComparableCosts = createSelector(
  getMaterialComparableCostsState,
  (state: MaterialComparableCostsState): MaterialComparableCost[] =>
    state.materialComparableCosts
);

export const getMaterialComparableCostsLoading = createSelector(
  getMaterialComparableCostsState,
  (state: MaterialComparableCostsState): boolean =>
    state.materialComparableCostsLoading
);
