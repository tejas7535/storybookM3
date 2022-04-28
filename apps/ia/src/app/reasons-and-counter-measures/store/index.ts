import { EntityState } from '@ngrx/entity';
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import moment from 'moment';

import {
  filterAdapter,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../shared/models';
import {
  getBeautifiedTimeRange,
  getMonth12MonthsAgo,
  getTimeRangeFromDates,
} from '../../shared/utils/utilities';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import {
  comparedFilterSelected,
  comparedTimePeriodSelected,
  loadComparedOrgUnits,
  loadComparedOrgUnitsFailure,
  loadComparedOrgUnitsSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  resetCompareMode,
} from './actions/reasons-and-counter-measures.actions';

export const reasonsAndCounterMeasuresFeatureKey = 'reasonsAndCounterMeasures';

const getInitialSelectedTimeRange = () => {
  const nowDate = moment();
  const oldDate = getMonth12MonthsAgo(nowDate);

  return getTimeRangeFromDates(oldDate, nowDate);
};

const initialTimeRange = getInitialSelectedTimeRange();

const initialComparedSelectedFilters = filterAdapter.getInitialState({
  ids: [FilterKey.TIME_RANGE],
  entities: {
    [FilterKey.TIME_RANGE]: {
      name: FilterKey.TIME_RANGE,
      idValue: {
        id: initialTimeRange,
        value: getBeautifiedTimeRange(initialTimeRange),
      },
    },
  },
});

export interface ReasonsAndCounterMeasuresState {
  reasonsForLeaving: {
    comparedOrgUnits: {
      loading: boolean;
      items: IdValue[];
      errorMessage: string;
    };
    comparedSelectedTimePeriod: TimePeriod;
    comparedSelectedFilters: EntityState<SelectedFilter>;
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
    comparedOrgUnits: {
      loading: false,
      items: [],
      errorMessage: undefined,
    },
    comparedSelectedTimePeriod: TimePeriod.LAST_12_MONTHS,
    comparedSelectedFilters: initialComparedSelectedFilters,
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
    comparedFilterSelected,
    (
      state: ReasonsAndCounterMeasuresState,
      { filter }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedSelectedFilters: filterAdapter.upsertOne(
          filter,
          state.reasonsForLeaving.comparedSelectedFilters
        ),
      },
    })
  ),
  on(
    comparedTimePeriodSelected,
    (
      state: ReasonsAndCounterMeasuresState,
      { timePeriod }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedSelectedTimePeriod: timePeriod,
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
        comparedSelectedFilters: initialComparedSelectedFilters,
        comparedSelectedTimePeriod: TimePeriod.LAST_12_MONTHS,
      },
    })
  ),
  on(
    loadComparedOrgUnits,
    (
      state: ReasonsAndCounterMeasuresState
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedOrgUnits: {
          ...state.reasonsForLeaving.comparedOrgUnits,
          loading: true,
        },
      },
    })
  ),
  on(
    loadComparedOrgUnitsSuccess,
    (
      state: ReasonsAndCounterMeasuresState,
      { items }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedOrgUnits: {
          ...state.reasonsForLeaving.comparedOrgUnits,
          loading: false,
          items,
        },
      },
    })
  ),
  on(
    loadComparedOrgUnitsFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedOrgUnits: {
          ...state.reasonsForLeaving.comparedOrgUnits,
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
