/* eslint-disable max-lines */
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import { Moment } from 'moment';

import { ExitEntryEmployeesResponse } from '../../overview/models';
import { DATA_IMPORT_DAY } from '../../shared/constants';
import { filterAdapter } from '../../shared/models';
import {
  getMonth12MonthsAgo,
  getTimeRangeFromDates,
} from '../../shared/utils/utilities';
import { ReasonForLeavingTab } from '../models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import {
  loadComparedLeaversByReason,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadLeaversByReason,
  loadLeaversByReasonFailure,
  loadLeaversByReasonSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  selectReasonsForLeavingTab,
} from './actions/reasons-and-counter-measures.actions';

export const reasonsAndCounterMeasuresFeatureKey = 'reasonsAndCounterMeasures';

export const getInitialSelectedTimeRange = (today: Moment) => {
  // use month before to prevent wrong calculations for the future
  const nowDate = today
    .clone()
    .utc()
    .subtract(DATA_IMPORT_DAY, 'days') // use previous month if data is not imported yet
    .subtract(1, 'month')
    .endOf('month');
  const oldDate = getMonth12MonthsAgo(nowDate);

  return getTimeRangeFromDates(oldDate, nowDate);
};

export interface ReasonsAndCounterMeasuresState {
  reasonsForLeaving: {
    selectedTab: ReasonForLeavingTab;
    reasons: {
      data: ReasonForLeavingStats;
      loading: boolean;
      errorMessage: string;
    };
    comparedReasons: {
      data: ReasonForLeavingStats;
      loading: boolean;
      errorMessage: string;
    };
    leavers: {
      data: ExitEntryEmployeesResponse;
      loading: boolean;
      errorMessage: string;
    };
  };
}

export const initialState: ReasonsAndCounterMeasuresState = {
  reasonsForLeaving: {
    selectedTab: ReasonForLeavingTab.OVERALL_REASONS,
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
    leavers: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
  },
};

export const reasonsAndCounterMeasuresReducer = createReducer(
  initialState,
  on(
    selectReasonsForLeavingTab,
    (
      state: ReasonsAndCounterMeasuresState,
      { selectedTab }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        selectedTab,
      },
    })
  ),
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
    loadLeaversByReason,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        leavers: {
          ...state.reasonsForLeaving.leavers,
          data: undefined,
          loading: true,
        },
      },
    })
  ),
  on(
    loadComparedLeaversByReason,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        leavers: {
          ...state.reasonsForLeaving.leavers,
          data: undefined,
          loading: true,
        },
      },
    })
  ),
  on(
    loadLeaversByReasonSuccess,
    (
      state: ReasonsAndCounterMeasuresState,
      { data }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        leavers: {
          ...state.reasonsForLeaving.leavers,
          data,
          loading: false,
          errorMessage: undefined,
        },
      },
    })
  ),
  on(
    loadLeaversByReasonFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        leavers: {
          ...state.reasonsForLeaving.leavers,
          data: undefined,
          errorMessage,
          loading: false,
        },
      },
    })
  )
);

const { selectAll } = filterAdapter.getSelectors();

export const selectAllComparedSelectedFilters = selectAll;

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
