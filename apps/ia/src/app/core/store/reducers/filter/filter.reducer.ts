import { Action, createReducer, on } from '@ngrx/store';

import { IdValue, TimePeriod } from '../../../../shared/models';
import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timePeriodSelected,
  timeRangeSelected,
} from '../../actions/filter/filter.action';
import { filterAdapter, SelectedFilterState } from './selected-filter.entity';

export const filterKey = 'filter';
export interface FilterState {
  orgUnits: IdValue[];
  timePeriods: IdValue[];
  loading: boolean;
  errorMessage: string;
  selectedFilters: SelectedFilterState; // currently selected filters
  selectedTimePeriod: TimePeriod;
  selectedTimeRange: string;
}

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
  selectedTimePeriod: TimePeriod.YEAR,
  selectedTimeRange: undefined,
};

export const filterReducer = createReducer(
  initialState,
  // initial filters
  on(loadInitialFilters, (state: FilterState) => ({
    ...state,
    loading: true,
    errorMessage: initialState.errorMessage,
  })),
  on(loadInitialFiltersSuccess, (state: FilterState, { filters }) => ({
    ...state,
    ...filters,
    loading: false,
  })),
  on(loadInitialFiltersFailure, (state: FilterState, { errorMessage }) => ({
    ...state,
    errorMessage,
    loading: false,
  })),
  on(filterSelected, (state: FilterState, { filter }) => ({
    ...state,
    selectedFilters: filterAdapter.upsertOne(filter, state.selectedFilters),
  })),
  on(timeRangeSelected, (state: FilterState, { timeRange }) => ({
    ...state,
    selectedTimeRange: timeRange,
  })),
  on(timePeriodSelected, (state: FilterState, { timePeriod }) => ({
    ...state,
    selectedTimePeriod: timePeriod,
  }))
);

const { selectAll } = filterAdapter.getSelectors();

export const selectAllSelectedFilters = selectAll;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: FilterState, action: Action): FilterState {
  return filterReducer(state, action);
}
