import { createSelector } from '@ngrx/store';

import { BasicFrequenciesResult } from '../../models';
import { getCatalogCalculationResultState } from '../../reducers';

export const getBasicFrequencies = createSelector(
  getCatalogCalculationResultState,
  (state): BasicFrequenciesResult => state.result
);

export const isLoading = createSelector(
  getCatalogCalculationResultState,
  (state): boolean => state.isLoading
);

export const getError = createSelector(
  getCatalogCalculationResultState,
  (state): string | undefined => state.calculationError
);

export const isCalculationResultAvailable = createSelector(
  getBasicFrequencies,
  (state): boolean => !!state
);
