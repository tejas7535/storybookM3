import { Action, createFeatureSelector, createReducer } from '@ngrx/store';

import { SelectedFilter, TimePeriod } from '../../shared/models';

export const reasonsAndCounterMeasuresFeatureKey = 'reasonsAndCounterMeasures';

export interface ReasonsAndCounterMeasuresState {
  reasonsForLeaving: {
    comparedSelectedOrgUnit: SelectedFilter; // currently selected filters
    comparedSelectedTimePeriod: TimePeriod;
    comparedSelectedTimeRange: string;
  };
}

export const initialState: ReasonsAndCounterMeasuresState = {
  reasonsForLeaving: {
    comparedSelectedOrgUnit: undefined,
    comparedSelectedTimePeriod: TimePeriod.YEAR,
    comparedSelectedTimeRange: undefined,
  },
};

export const reasonsAndCounterMeasuresReducer = createReducer(initialState);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: ReasonsAndCounterMeasuresState,
  action: Action
): ReasonsAndCounterMeasuresState {
  return reasonsAndCounterMeasuresReducer(state, action);
}

export const selectReasonsAndCounterMeasuresState =
  createFeatureSelector<ReasonsAndCounterMeasuresState>(
    reasonsAndCounterMeasuresFeatureKey
  );
