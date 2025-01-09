import { createSelector } from '@ngrx/store';

import { getCalculationOptionsSelectionState } from '../../reducers';

export const getOptions = createSelector(
  getCalculationOptionsSelectionState,
  (state) => state?.options
);
