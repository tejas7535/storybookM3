import { createSelector } from '@ngrx/store';

import { ReportMessages } from '../../models/calculation-result-state.model';
import { getCalculationResultState } from '../../reducers';

export const getCalculationInputs = createSelector(
  getCalculationResultState,
  (state) => state?.result?.inputs || undefined
);

export const getCalculationMessages = createSelector(
  getCalculationResultState,
  (state) =>
    state?.result?.reportMessages ||
    ({
      notes: [],
      warnings: [],
      errors: [],
    } as ReportMessages)
);

export const isResultAvailable = createSelector(
  getCalculationResultState,
  (state) => !!state?.result && !state.isLoading
);
