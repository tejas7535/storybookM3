import { createSelector } from '@ngrx/store';

import { FrictionCalculationResult } from '../../models';
import { getFrictionCalculationResultState } from '../../reducers';

export const getCalculationResult = createSelector(
  getFrictionCalculationResultState,
  (state): FrictionCalculationResult => state.calculationResult
);

export const isCalculationImpossible = createSelector(
  getFrictionCalculationResultState,
  (state): boolean => state.isCalculationImpossible
);

export const getModelId = createSelector(
  getFrictionCalculationResultState,
  (state): string | undefined => state.modelId
);

export const getCalculationId = createSelector(
  getFrictionCalculationResultState,
  (state): string | undefined => state.calculationId
);

export const isLoading = createSelector(
  getFrictionCalculationResultState,
  (state): boolean => state.isLoading
);

export const getError = createSelector(
  getFrictionCalculationResultState,
  (state): string | undefined => state.calculationError
);

export const isCalculationResultAvailable = createSelector(
  getCalculationResult,
  (state): boolean => !!state
);
