import { createSelector } from '@ngrx/store';

import { getLoadSenseState } from '../../reducers';
import { LoadSenseState } from '../../reducers/load-sense/load-sense.reducer';
import { LoadSense } from '../../reducers/load-sense/models';
import { Interval } from '../../reducers/shared/models';

// Will at some point only return true if last result is not too old
export const getLiveStatus = createSelector(
  getLoadSenseState,
  (state: LoadSenseState): boolean => state && false
);

export const getLoadSenseLoading = createSelector(
  getLoadSenseState,
  (state: LoadSenseState) => state.loading
);

export const getLoadSenseResult = createSelector(
  getLoadSenseState,
  (state: LoadSenseState): LoadSense[] => state.result
);

export const getLoadInterval = createSelector(
  getLoadSenseState,
  (state: LoadSenseState): Interval => state.interval
);
