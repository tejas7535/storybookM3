import { EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { IdValue, SelectedFilter, TimePeriod } from '../../../../shared/models';
import {
  getMonth12MonthsAgo,
  getTimeRangeFromDates,
} from '../../../../shared/utils/utilities';
import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timePeriodSelected,
  timeRangeSelected,
} from '../../actions/filter/filter.action';
import { filterAdapter } from '../filter/selected-filter.entity';

export const filterKey = 'filter';
export interface FilterState {
  orgUnits: IdValue[];
  timePeriods: IdValue[];
  loading: boolean;
  errorMessage: string;
  selectedFilters: EntityState<SelectedFilter>; // currently selected filters
  selectedTimePeriod: TimePeriod;
  selectedTimeRange: string;
}

const getInitialSelectedTimeRange = () => {
  const nowDate = new Date();
  const oldDate = getMonth12MonthsAgo(nowDate);

  return getTimeRangeFromDates(oldDate, nowDate);
};

export const initialState: FilterState = {
  orgUnits: [],
  timePeriods: [
    {
      id: TimePeriod.YEAR,
      value: TimePeriod.YEAR,
    },
    {
      id: TimePeriod.LAST_12_MONTHS,
      value: TimePeriod.LAST_12_MONTHS,
    },
    {
      id: TimePeriod.MONTH,
      value: TimePeriod.MONTH,
    },
    {
      id: TimePeriod.CUSTOM,
      value: TimePeriod.CUSTOM,
    },
  ],
  loading: false,
  errorMessage: undefined,
  selectedFilters: filterAdapter.getInitialState(),
  selectedTimePeriod: TimePeriod.LAST_12_MONTHS,
  selectedTimeRange: getInitialSelectedTimeRange(),
};

export const filterReducer = createReducer(
  initialState,
  // initial filters
  on(
    loadInitialFilters,
    (state: FilterState): FilterState => ({
      ...state,
      loading: true,
      errorMessage: initialState.errorMessage,
    })
  ),
  on(
    loadInitialFiltersSuccess,
    (state: FilterState, { filters }): FilterState => ({
      ...state,
      ...filters,
      loading: false,
    })
  ),
  on(
    loadInitialFiltersFailure,
    (state: FilterState, { errorMessage }): FilterState => ({
      ...state,
      errorMessage,
      loading: false,
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
    timeRangeSelected,
    (state: FilterState, { timeRange }): FilterState => ({
      ...state,
      selectedTimeRange: timeRange,
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
