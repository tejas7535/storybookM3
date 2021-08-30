import { createSelector } from '@ngrx/store';
import { MaterialAlternativeCostsState } from '../../reducers/material-alternative-costs/material-alternative-costs.reducer';
import { MaterialAlternativeCost } from '../../../../shared/models/quotation-detail/material-alternative-cost.model';
import { getMaterialAlternativeCostsState } from '../../reducers';

export const getMaterialAlternativeCosts = createSelector(
  getMaterialAlternativeCostsState,
  (state: MaterialAlternativeCostsState): MaterialAlternativeCost[] =>
    state.materialAlternativeCosts
);

export const getMaterialAlternativeCostsLoading = createSelector(
  getMaterialAlternativeCostsState,
  (state: MaterialAlternativeCostsState): boolean =>
    state.materialAlternativeCostsLoading
);
