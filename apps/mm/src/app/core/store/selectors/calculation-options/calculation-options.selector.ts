import { createSelector } from '@ngrx/store';

import { getCalculationOptionsSelectionState } from '../../reducers';

export const getOptions = createSelector(
  getCalculationOptionsSelectionState,
  (state) => state?.options
);

export const getCalculationPerformed = createSelector(
  getCalculationOptionsSelectionState,
  (state) => state?.calculationPerformed
);

export const getToleranceClasses = createSelector(
  getCalculationOptionsSelectionState,
  (state) => state?.toleranceClasses || []
);

export const getThermalOptions = createSelector(
  getCalculationOptionsSelectionState,
  (state) => state?.thermalOptions
);
