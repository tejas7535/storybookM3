import { createSelector } from '@ngrx/store';

import { BasicFrequenciesResult, CatalogCalculationResult } from '../../models';
import { getCatalogCalculationResultState } from '../../reducers';

export const getBasicFrequencies = createSelector(
  getCatalogCalculationResultState,
  (state): BasicFrequenciesResult => state.basicFrequencies
);

export const getCalculationResult = createSelector(
  getCatalogCalculationResultState,
  (state): CatalogCalculationResult => state.result
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
  getCalculationResult,
  getError,
  (state, error): boolean => !error && !!state
);

export const getVersions = createSelector(
  getCatalogCalculationResultState,
  (state): string | undefined =>
    state.versions && Object.keys(state.versions).length > 0
      ? Object.entries(state.versions)
          .map(([key, value]) => `${key} ${value}`)
          .join(' / ')
      : undefined
);
