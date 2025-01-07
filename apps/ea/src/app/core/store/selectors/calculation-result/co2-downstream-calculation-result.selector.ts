import { DownstreamApiInputs } from '@ea/core/services/downstream-calculation.service.interface';
import { createSelector } from '@ngrx/store';

import { DownstreamCalculationResult } from '../../models';
import { getDownstreamCalculationState } from '../../reducers';

export const getDownstreamCalculationStateResult = createSelector(
  getDownstreamCalculationState,
  (state): DownstreamCalculationResult => state?.result
);

export const getDownstreamCalculationStateInputs = createSelector(
  getDownstreamCalculationState,
  (state): DownstreamApiInputs => state?.inputs
);

export const isDownstreamCalculationLoading = createSelector(
  getDownstreamCalculationState,
  (state): boolean => state.isLoading
);

export const getDownstreamErrors = createSelector(
  getDownstreamCalculationState,
  (state): string[] | undefined => state.errors
);

export const isDownstreamResultAvailable = createSelector(
  getDownstreamCalculationStateResult,
  getDownstreamErrors,
  (state, error): boolean =>
    !!state && Array.isArray(error) && error.length === 0
);
