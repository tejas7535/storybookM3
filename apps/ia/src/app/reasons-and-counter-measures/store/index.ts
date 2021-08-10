import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { SelectedFilter, TimePeriod } from '../../shared/models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import {
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
} from './actions/reasons-and-counter-measures.actions';

export const reasonsAndCounterMeasuresFeatureKey = 'reasonsAndCounterMeasures';

export interface ReasonsAndCounterMeasuresState {
  reasonsForLeaving: {
    comparedSelectedOrgUnit: SelectedFilter; // currently selected filters
    comparedSelectedTimePeriod: TimePeriod;
    comparedSelectedTimeRange: string;
    reasons: {
      data: ReasonForLeavingStats[];
      loading: boolean;
      errorMessage: string;
    };
    comparedReasons: {
      data: ReasonForLeavingStats[];
      loading: boolean;
      errorMessage: string;
    };
  };
}

export const initialState: ReasonsAndCounterMeasuresState = {
  reasonsForLeaving: {
    comparedSelectedOrgUnit: undefined,
    comparedSelectedTimePeriod: TimePeriod.YEAR,
    comparedSelectedTimeRange: undefined,
    reasons: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
    comparedReasons: {
      data: undefined,
      loading: undefined,
      errorMessage: undefined,
    },
  },
};

export const reasonsAndCounterMeasuresReducer = createReducer(
  initialState,
  on(
    loadReasonsWhyPeopleLeft,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          loading: true,
        },
      },
    })
  ),
  on(
    loadReasonsWhyPeopleLeftSuccess,
    (
      state: ReasonsAndCounterMeasuresState,
      { data }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadReasonsWhyPeopleLeftFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        reasons: {
          ...state.reasonsForLeaving.reasons,
          data: undefined,
          errorMessage,
          loading: false,
        },
      },
    })
  )
);

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
