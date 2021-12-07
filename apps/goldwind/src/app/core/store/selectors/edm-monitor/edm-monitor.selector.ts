import { createSelector } from '@ngrx/store';

import { getEdmMonitorState } from '../../reducers';
import { EdmMonitorState } from '../../reducers/edm-monitor/edm-monitor.reducer';
import { EdmStatus } from '../../reducers/edm-monitor/models';
import { Interval } from '../../reducers/shared/models';

export const getEdmLoading = createSelector(
  getEdmMonitorState,
  (state: EdmMonitorState): boolean => state.loading
);

export const getEdmResult = createSelector(
  getEdmMonitorState,
  (state: EdmMonitorState): EdmStatus[] => state.measurements
);

export const getEdmInterval = createSelector(
  getEdmMonitorState,
  (state: EdmMonitorState): Interval => state.interval
);
