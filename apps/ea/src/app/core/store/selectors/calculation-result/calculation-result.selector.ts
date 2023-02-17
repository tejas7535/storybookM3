import { createSelector } from '@ngrx/store';

import { CalculationResultState } from '../../models';
import { getCalculationResultState } from '../../reducers';

// Placeholder Selector
export const getCalculationResult = createSelector(
  getCalculationResultState,
  (state): CalculationResultState => state
);
