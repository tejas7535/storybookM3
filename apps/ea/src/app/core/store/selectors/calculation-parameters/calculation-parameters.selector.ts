import { createSelector } from '@ngrx/store';

import { CalculationParametersOperationConditions } from '../../models';
import { getCalculationParametersState } from '../../reducers';

export const getOperationConditions = createSelector(
  getCalculationParametersState,
  (state): CalculationParametersOperationConditions => state.operationConditions
);

export const isCalculationMissingInput = createSelector(
  getCalculationParametersState,
  (state): boolean => state.isInputInvalid
);
