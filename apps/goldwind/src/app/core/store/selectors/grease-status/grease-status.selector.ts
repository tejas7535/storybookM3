import { createSelector } from '@ngrx/store';

import { getGreaseStatusState } from '../../reducers';
import { GreaseStatusState } from '../../reducers/grease-status/grease-status.reducer';

export const getGreaseSensorId = createSelector(
  getGreaseStatusState,
  () => 'ee7bffbe-2e87-49f0-b763-ba235dd7c876'
);

export const getGreaseStatusLoading = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.loading
);

export const getGreaseStatusResult = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.result
);

export const getGreaseDisplay = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.display
);
