import { EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import moment from 'moment';

import { DEFAULT_TIME_PERIOD_FILTERS } from '../../../../shared/constants';
import {
  filterAdapter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import { getBeautifiedTimeRange } from '../../../../shared/utils/utilities';
import {
  activateTimePeriodFilters,
  benchmarkFilterSelected,
  filterDimensionSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
  resetTimeRangeFilter,
  setAvailableTimePeriods,
  timePeriodSelected,
} from '../../actions/filter/filter.action';
import { getInitialSelectedTimeRange, getMaxDate } from './filter.helpers';
import {
  activateTimePeriodFiltersReducer,
  benchmarkFilterSelectedReducer,
  filterDimensionSelectedReducer,
  filterSelectedReducer,
  loadFilterBenchmarkDimensionDataReducer,
  loadFilterDimensionDataFailureReducer,
  loadFilterDimensionDataReducer,
  loadFilterDimensionDataSuccessReducer,
  resetTimeRangeFilterReducer,
  setAvailableTimePeriodsReducer,
  timePeriodSelectedReducer,
} from './filter.reducers';

export const filterKey = 'filter';

export interface FilterData {
  loading: boolean;
  items: IdValue[];
  errorMessage: string;
}

export interface FilterState {
  data: Record<FilterDimension, FilterData>;
  timePeriods: IdValue[];
  selectedFilters: EntityState<SelectedFilter>; // currently selected filters
  benchmarkFilters: EntityState<SelectedFilter>; // currently selected benchmark filters
  selectedTimePeriod: TimePeriod;
  selectedDimension: FilterDimension;
  benchmarkDimension: FilterDimension;
  timeRangeConstraints: {
    min: number;
    max: number;
  };
}

export const initialTimeRange = getInitialSelectedTimeRange(moment.utc());

/**
 * Generate initial filter data for all dimensions
 */
function createInitialFilterData(): Record<FilterDimension, FilterData> {
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.values(FilterDimension).reduce(
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
  );
}

/**
 * Create initial time range selected filter
 */
function createInitialTimeRangeFilter() {
  return filterAdapter.getInitialState({
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
}

/**
 * Create initial benchmark filters
 */
function createInitialBenchmarkFilters() {
  return filterAdapter.getInitialState({
    ids: [FilterKey.TIME_RANGE, FilterDimension.ORG_UNIT],
    entities: {
      [FilterKey.TIME_RANGE]: {
        name: FilterKey.TIME_RANGE,
        idValue: {
          id: initialTimeRange,
          value: getBeautifiedTimeRange(initialTimeRange),
        },
      },
      [FilterDimension.ORG_UNIT]: {
        name: FilterDimension.ORG_UNIT,
        idValue: {
          id: '50008377',
          value: 'Schaeffler',
        },
      },
    },
  });
}

export const initialState: FilterState = {
  data: createInitialFilterData(),
  timePeriods: DEFAULT_TIME_PERIOD_FILTERS,
  selectedFilters: createInitialTimeRangeFilter(),
  benchmarkFilters: createInitialBenchmarkFilters(),
  selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
  selectedDimension: undefined,
  benchmarkDimension: FilterDimension.ORG_UNIT,
  timeRangeConstraints: {
    min: undefined,
    max: getMaxDate(),
  },
};

export const filterReducer = createReducer(
  initialState,
  on(resetTimeRangeFilter, (state) =>
    resetTimeRangeFilterReducer(state, initialTimeRange)
  ),
  on(loadFilterBenchmarkDimensionData, (state, { filterDimension }) =>
    loadFilterBenchmarkDimensionDataReducer(state, { filterDimension })
  ),
  on(loadFilterDimensionData, (state, { filterDimension }) =>
    loadFilterDimensionDataReducer(state, { filterDimension })
  ),
  on(loadFilterDimensionDataSuccess, (state, { filterDimension, items }) =>
    loadFilterDimensionDataSuccessReducer(state, { filterDimension, items })
  ),
  on(
    loadFilterDimensionDataFailure,
    (state, { filterDimension, errorMessage }) =>
      loadFilterDimensionDataFailureReducer(state, {
        filterDimension,
        errorMessage,
      })
  ),
  on(filterSelected, (state, { filter }) =>
    filterSelectedReducer(state, { filter })
  ),
  on(benchmarkFilterSelected, (state, { filter }) =>
    benchmarkFilterSelectedReducer(state, { filter })
  ),
  on(filterDimensionSelected, (state, { filterDimension, filter }) =>
    filterDimensionSelectedReducer(state, { filterDimension, filter })
  ),
  on(timePeriodSelected, (state, { timePeriod }) =>
    timePeriodSelectedReducer(state, { timePeriod })
  ),
  on(activateTimePeriodFilters, (state, params) =>
    activateTimePeriodFiltersReducer(state, params)
  ),
  on(setAvailableTimePeriods, (state, { timePeriods }) =>
    setAvailableTimePeriodsReducer(state, { timePeriods })
  )
);

const { selectAll } = filterAdapter.getSelectors();

export const selectAllSelectedFilters = selectAll;

export const reducer = (state: FilterState, action: Action): FilterState =>
  filterReducer(state, action);
