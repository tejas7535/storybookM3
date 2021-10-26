import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { TimePeriod } from '../../shared/models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import {
  changeComparedFilter,
  changeComparedTimePeriod,
  changeComparedTimeRange,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  resetCompareMode,
} from './actions/reasons-and-counter-measures.actions';

export const reasonsAndCounterMeasuresFeatureKey = 'reasonsAndCounterMeasures';

export interface ReasonsAndCounterMeasuresState {
  reasonsForLeaving: {
    comparedSelectedOrgUnit: string; // currently selected filters
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
    comparedSelectedTimePeriod: TimePeriod.LAST_12_MONTHS,
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
  ),
  on(
    changeComparedFilter,
    (
      state: ReasonsAndCounterMeasuresState,
      { comparedSelectedOrgUnit }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedSelectedOrgUnit,
      },
    })
  ),
  on(
    changeComparedTimePeriod,
    (
      state: ReasonsAndCounterMeasuresState,
      { comparedSelectedTimePeriod }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedSelectedTimePeriod,
      },
    })
  ),
  on(
    changeComparedTimeRange,
    (
      state: ReasonsAndCounterMeasuresState,
      { comparedSelectedTimeRange }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedSelectedTimeRange,
      },
    })
  ),
  on(
    loadComparedReasonsWhyPeopleLeft,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          loading: true,
        },
      },
    })
  ),
  on(
    loadComparedReasonsWhyPeopleLeftSuccess,
    (
      state: ReasonsAndCounterMeasuresState,
      { data }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadComparedReasonsWhyPeopleLeftFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          ...state.reasonsForLeaving.comparedReasons,
          data: undefined,
          errorMessage,
          loading: false,
        },
      },
    })
  ),
  on(
    resetCompareMode,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedReasons: {
          data: undefined,
          loading: undefined,
          errorMessage: undefined,
        },
        comparedSelectedOrgUnit: undefined,
        comparedSelectedTimePeriod: TimePeriod.LAST_12_MONTHS,
        // comparedSelectedTimeRange needs to stay as the last selected value
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
