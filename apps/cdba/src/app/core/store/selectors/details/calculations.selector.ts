import { createSelector } from '@ngrx/store';

import { Calculation, ExcludedCalculations } from '@cdba/shared/models';

import { getDetailState } from '../../reducers';
import { DetailState } from '../../reducers/detail/detail.reducer';

export const getCalculations = createSelector(
  getDetailState,
  (state: DetailState): Calculation[] => state.calculations.items
);

export const getExcludedCalculations = createSelector(
  getDetailState,
  (state: DetailState): ExcludedCalculations => state.calculations.excludedItems
);

export const getCalculationsLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.calculations.loading
);

export const getCalculationsError = createSelector(
  getDetailState,
  (state: DetailState) => state.calculations.errorMessage
);

export const getSelectedCalculation = createSelector(
  getDetailState,
  (state: DetailState) => state.calculations.selectedCalculation?.calculation
);

export const getSelectedCalculationNodeId = createSelector(
  getDetailState,
  (state: DetailState): string[] =>
    state.calculations.selectedCalculation?.nodeId
      ? [state.calculations.selectedCalculation.nodeId]
      : undefined
);

export const getSelectedCalculationNodeIds = createSelector(
  getDetailState,
  (state: DetailState): string[] => state.calculations.selectedNodeIds
);
