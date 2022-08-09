import { EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import moment, { Moment } from 'moment';

import { DATA_IMPORT_DAY } from '../../../../shared/constants';
import {
  filterAdapter,
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
  filterSelected,
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

export enum FilterDimension {
  ORG_UNITS = 'orgUnits',
  REGIONS = 'regions',
  SUB_REGIONS = 'subRegions',
  COUNTRIES = 'countries',
  FUNCTIONS = 'functions',
  SUB_FUNCTIONS = 'subFunctions',
  SEGMENTS = 'segments',
  SUB_SEGMENTS = 'subSegments',
  SEGMENT_UNITS = 'segmentUnits',
  BOARDS = 'boards',
  SUB_BOARDS = 'subBoards',
}

export interface FilterState {
  data: Record<FilterDimension, FilterData>;
  timePeriods: IdValue[];
  selectedFilters: EntityState<SelectedFilter>; // currently selected filters
  selectedTimePeriod: TimePeriod;
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

const initialTimeRange = getInitialSelectedTimeRange(moment.utc());

export const initialState: FilterState = {
  data: {
    // eslint-disable-next-line unicorn/no-array-reduce
    ...Object.values(FilterDimension).reduce(
      (map, curr) => (
        (map[curr] = {
          loading: false,
          items: [],
          errorMessage: undefined,
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
  selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
};

export const filterReducer = createReducer(
  initialState,
  on(
    loadFilterDimensionData,
    (state: FilterState, { filterDimension: filterType }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [filterType]: {
          ...state.data[filterType],
          loading: true,
        },
      },
    })
  ),
  on(
    loadFilterDimensionDataSuccess,
    (state: FilterState, { items }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [FilterDimension.ORG_UNITS]: {
          ...state.data.orgUnits,
          loading: false,
          items,
        },
      },
    })
  ),
  on(
    loadFilterDimensionDataFailure,
    (state: FilterState, { errorMessage }): FilterState => ({
      ...state,
      data: {
        ...state.data,
        [FilterDimension.ORG_UNITS]: {
          ...state.data.orgUnits,
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
