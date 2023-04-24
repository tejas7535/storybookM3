import { createSelector } from '@ngrx/store';

import { CO2UpstreamCalculationResult } from '../../models';
import { getCO2UpstreamCalculationResultState } from '../../reducers';

export const getCalculationResult = createSelector(
  getCO2UpstreamCalculationResultState,
  (state): CO2UpstreamCalculationResult => state.calculationResult
);

export const isLoading = createSelector(
  getCO2UpstreamCalculationResultState,
  (state): boolean => state.isLoading
);

export const getError = createSelector(
  getCO2UpstreamCalculationResultState,
  (state): string | undefined => state.calculationError
);

export const isCalculationResultAvailable = createSelector(
  getCalculationResult,
  (state): boolean => !!state
);
