import { EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import moment, { Moment } from 'moment';

import { DATA_IMPORT_DAY } from '../../../../shared/constants';
import {
  filterAdapter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import {
  getBeautifiedTimeRange,
  getMonth12MonthsAgo,
  getTimeRangeFromDates,
} from '../../../../shared/utils/utilities';
import {
  benchmarkFilterSelected,
  filterDimensionSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
  timePeriodSelected,
} from '../../actions/filter/filter.action';

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
}

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

export const initialTimeRange = getInitialSelectedTimeRange(moment.utc());

export const initialState: FilterState = {
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
  timePeriods: [
    {
      id: TimePeriod.YEAR,
      value: TimePeriod.YEAR,
    },
    {
      id: TimePeriod.MONTH,
      value: TimePeriod.MONTH,
    },
    {
      id: TimePeriod.LAST_12_MONTHS,
      value: TimePeriod.LAST_12_MONTHS,
    },
  ],
  selectedFilters: filterAdapter.getInitialState({
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
  }),
  benchmarkFilters: filterAdapter.getInitialState({
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
  }),
  selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
  selectedDimension: undefined,
  benchmarkDimension: FilterDimension.ORG_UNIT,
};

export const filterReducer = createReducer(
  initialState,
  on(
    loadFilterBenchmarkDimensionData,
    (state: FilterState, { filterDimension }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [filterDimension]: {
          ...state.data[filterDimension],
          loading: true,
        },
      },
      benchmarkDimension: filterDimension,
    })
  ),
  on(
    loadFilterDimensionData,
    (state: FilterState, { filterDimension }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [filterDimension]: {
          ...state.data[filterDimension],
          loading: true,
        },
      },
      selectedDimension: filterDimension,
    })
  ),
  on(
    loadFilterDimensionDataSuccess,
    (state: FilterState, { filterDimension, items }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [filterDimension]: {
          ...state.data[filterDimension],
          loading: false,
          items,
        },
      },
    })
  ),
  on(
    loadFilterDimensionDataFailure,
    (state: FilterState, { filterDimension, errorMessage }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [filterDimension]: {
          ...state.data[filterDimension],
          errorMessage,
          loading: false,
        },
      },
    })
  ),
  on(
    filterSelected,
    (state: FilterState, { filter }): FilterState => ({
      ...state,
      selectedFilters: filterAdapter.upsertOne(filter, state.selectedFilters),
      selectedDimension: Object.values(FilterDimension).find(
        (d) => d === filter.name
      ),
      // There is only one time range filter for now. It makes changes for both filter collections.
      // So, when time range filter changes, make updates in benchmark filters too.
      benchmarkFilters:
        filter.name === FilterKey.TIME_RANGE
          ? filterAdapter.upsertOne(filter, state.benchmarkFilters)
          : state.benchmarkFilters,
    })
  ),
  on(
    benchmarkFilterSelected,
    (state: FilterState, { filter }): FilterState => ({
      ...state,
      benchmarkFilters: filterAdapter.upsertOne(filter, state.benchmarkFilters),
    })
  ),
  on(
    filterDimensionSelected,
    (state: FilterState, { filterDimension, filter }): FilterState => ({
      ...state,
      selectedFilters: filterAdapter.upsertOne(filter, state.selectedFilters),
      selectedDimension: filterDimension,
    })
  ),
  on(
    timePeriodSelected,
    (state: FilterState, { timePeriod }): FilterState => ({
      ...state,
      selectedTimePeriod: timePeriod,
    })
  )
);

const { selectAll } = filterAdapter.getSelectors();

export const selectAllSelectedFilters = selectAll;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: FilterState, action: Action): FilterState {
  return filterReducer(state, action);
}
