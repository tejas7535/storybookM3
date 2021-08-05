import { createSelector } from '@ngrx/store';

import {
  ReasonsAndCounterMeasuresState,
  selectReasonsAndCounterMeasuresState,
} from '..';

export const getComparedSelectedOrgUnit = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving?.comparedSelectedOrgUnit.value?.toString()
);

export const getComparedSelectedTimePeriod = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedTimePeriod
);

export const getComparedSelectedTimeRange = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedTimeRange
);
