import { createSelector } from '@ngrx/store';

import { getCalculationParametersState } from '../../reducers';

export const getCalculationParameters = createSelector(
  getCalculationParametersState,
  (state) => state?.parameters || undefined
);
