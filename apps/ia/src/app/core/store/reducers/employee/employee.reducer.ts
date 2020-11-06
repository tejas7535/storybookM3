import { Action, createReducer, on } from '@ngrx/store';

import { IdValue, TimePeriod } from '../../../../shared/models';
import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timePeriodSelected,
  timeRangeSelected,
} from '../../actions/employee/employee.action';
import { filterAdapter, FilterState } from './filter.entity';

export interface EmployeeState {
  filters: {
    organizations: IdValue[];
    regionsAndSubRegions: IdValue[]; // after PoC: needs to have dependencies to countries + locations
    countries: IdValue[]; // after PoC: needs to be dependent on region
    locations: IdValue[]; // after PoC: needs to be dependent on country
    timePeriods: IdValue[];
    loading: boolean;
    errorMessage: string;
    selectedFilters: FilterState; // currently selected filters
    selectedTimePeriod: TimePeriod;
    selectedTimeRange: string;
  };
}

export const initialState: EmployeeState = {
  filters: {
    organizations: [],
    regionsAndSubRegions: [],
    countries: [],
    locations: [],
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
  },
};

export const employeeReducer = createReducer(
  initialState,
  // initial filters
  on(loadInitialFilters, (state: EmployeeState) => ({
    ...state,
    filters: { ...state.filters, loading: true, errorMessage: undefined },
  })),
  on(loadInitialFiltersSuccess, (state: EmployeeState, { filters }) => ({
    ...state,
    filters: {
      ...state.filters,
      loading: false,
      ...filters,
    },
  })),
  on(loadInitialFiltersFailure, (state: EmployeeState, { errorMessage }) => ({
    ...state,
    filters: { ...state.filters, errorMessage, loading: false },
  })),
  on(filterSelected, (state: EmployeeState, { filter }) => ({
    ...state,
    filters: {
      ...state.filters,
      selectedFilters: filterAdapter.upsertOne(
        filter,
        state.filters.selectedFilters
      ),
    },
  })),
  on(timeRangeSelected, (state: EmployeeState, { timeRange }) => ({
    ...state,
    filters: {
      ...state.filters,
      selectedTimeRange: timeRange,
    },
  })),
  on(timePeriodSelected, (state: EmployeeState, { timePeriod }) => ({
    ...state,
    filters: {
      ...state.filters,
      selectedTimePeriod: timePeriod,
    },
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: EmployeeState, action: Action): EmployeeState {
  return employeeReducer(state, action);
}
