/* eslint-disable max-lines */
import { EntityState } from '@ngrx/entity';
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import moment, { Moment } from 'moment';

import { FilterData } from '../../core/store/reducers/filter/filter.reducer';
import { DATA_IMPORT_DAY } from '../../shared/constants';
import {
  filterAdapter,
  FilterDimension,
  FilterKey,
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
  comparedFilterDimensionSelected,
  comparedFilterSelected,
  comparedTimePeriodSelected,
  loadComparedFilterDimensionData,
  loadComparedFilterDimensionDataFailure,
  loadComparedFilterDimensionDataSuccess,
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

const initialTimeRange = getInitialSelectedTimeRange(moment.utc());

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
    data: Record<FilterDimension, FilterData>;
    comparedSelectedTimePeriod: TimePeriod;
    comparedSelectedFilters: EntityState<SelectedFilter>;
    comparedSelectedDimension: FilterDimension;
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
    data: {
      // eslint-disable-next-line unicorn/no-array-reduce
      ...Object.values(FilterDimension).reduce(
        (map, curr) => (
          (map[curr] = {
            loading: false,
            items: [],
            errorMessage: undefined,
            // eslint-disable-next-line no-sequences
          }),
          map
        ),
        {} as any
      ),
    },
    comparedSelectedDimension: undefined,
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
    comparedFilterDimensionSelected,
    (
      state: ReasonsAndCounterMeasuresState,
      { filterDimension, filter }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedSelectedFilters: filterAdapter.upsertOne(
          filter,
          state.reasonsForLeaving.comparedSelectedFilters
        ),
        comparedSelectedDimension: filterDimension,
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
        data: {
          ...state.reasonsForLeaving.data,
          [FilterDimension.ORG_UNIT]: {
            ...state.reasonsForLeaving.data[FilterDimension.ORG_UNIT],
            loading: true,
          },
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
        data: {
          ...state.reasonsForLeaving.data,
          [FilterDimension.ORG_UNIT]: {
            ...state.reasonsForLeaving.data[FilterDimension.ORG_UNIT],
            loading: false,
            items,
          },
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
        data: {
          ...state.reasonsForLeaving.data,
          [FilterDimension.ORG_UNIT]: {
            ...state.reasonsForLeaving.data[FilterDimension.ORG_UNIT],
            errorMessage,
            loading: false,
          },
        },
      },
    })
  ),
  on(
    loadComparedFilterDimensionData,
    (
      state: ReasonsAndCounterMeasuresState,
      { filterDimension }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        comparedSelectedDimension: filterDimension,
        data: {
          ...state.reasonsForLeaving.data,
          [filterDimension]: {
            ...state.reasonsForLeaving.data[filterDimension],
            loading: true,
          },
        },
      },
    })
  ),
  on(
    loadComparedFilterDimensionDataSuccess,
    (
      state: ReasonsAndCounterMeasuresState,
      { filterDimension, items }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        data: {
          ...state.reasonsForLeaving.data,
          [filterDimension]: {
            ...state.reasonsForLeaving.data[filterDimension],
            loading: false,
            items,
          },
        },
      },
    })
  ),
  on(
    loadComparedFilterDimensionDataFailure,
    (
      state: ReasonsAndCounterMeasuresState,
      { filterDimension, errorMessage }
    ): ReasonsAndCounterMeasuresState => ({
      ...state,
      reasonsForLeaving: {
        ...state.reasonsForLeaving,
        data: {
          ...state.reasonsForLeaving.data,
          [filterDimension]: {
            ...state.reasonsForLeaving.data[filterDimension],
            errorMessage,
            loading: false,
          },
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
