import { Action, createReducer, on } from '@ngrx/store';

import { IdValue } from '../../../../shared/models';
import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
} from '../../actions/employee/employee.action';
import { filterAdapter, FilterState } from './filter.entity';

export interface EmployeeState {
  filters: {
    organizations: IdValue[];
    regionAndSubRegions: IdValue[]; // after PoC: needs to have dependencies to countries + locations
    countries: IdValue[]; // after PoC: needs to be dependent on region
    locations: IdValue[]; // after PoC: needs to be dependent on country
    timePeriods: string[];
    loading: boolean;
    errorMessage: string;
    currentSelection: FilterState; // currently selected filters
  };
}

export const initialState: EmployeeState = {
  filters: {
    organizations: [],
    regionAndSubRegions: [],
    countries: [],
    locations: [],
    timePeriods: ['month', 'currentYear', 'last365Days'],
    loading: false,
    errorMessage: undefined,
    currentSelection: filterAdapter.getInitialState(),
  },
};

export const employeesReducer = createReducer(
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
      currentSelection: filterAdapter.upsertOne(
        filter,
        state.filters.currentSelection
      ),
    },
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: EmployeeState, action: Action): EmployeeState {
  return employeesReducer(state, action);
}
