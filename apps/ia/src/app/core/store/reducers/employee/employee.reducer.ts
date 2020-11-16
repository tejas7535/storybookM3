import { Action, createReducer, on } from '@ngrx/store';

import { ChartType } from '../../../../overview/models/chart-type.enum';
import { Employee, IdValue, TimePeriod } from '../../../../shared/models';
import {
  filterSelected,
  loadEmployees,
  loadEmployeesFailure,
  loadEmployeesSuccess,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timePeriodSelected,
  timeRangeSelected,
} from '../../actions/employee/employee.action';
import { filterAdapter, SelectedFilterState } from './selected-filter.entity';

export interface EmployeeState {
  filters: {
    orgUnits: IdValue[];
    regionsAndSubRegions: IdValue[]; // after PoC: needs to have dependencies to countries + locations
    countries: IdValue[]; // after PoC: needs to be dependent on region
    hrLocations: IdValue[]; // after PoC: needs to be dependent on country
    timePeriods: IdValue[];
    loading: boolean;
    errorMessage: string;
    selectedFilters: SelectedFilterState; // currently selected filters
    selectedTimePeriod: TimePeriod;
    selectedTimeRange: string;
  };
  overview: {
    selectedChart: ChartType;
  };
  employees: {
    loading: boolean;
    result: Employee[];
    errorMessage: string;
  };
}

export const initialState: EmployeeState = {
  filters: {
    orgUnits: [],
    regionsAndSubRegions: [],
    countries: [],
    hrLocations: [],
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
  overview: {
    selectedChart: ChartType.ORG_CHART,
  },
  employees: {
    loading: false,
    result: [],
    errorMessage: undefined,
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
      ...filters,
      loading: false,
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
  })),
  on(loadEmployees, (state: EmployeeState) => ({
    ...state,
    employees: {
      ...state.employees,
      loading: true,
    },
  })),
  on(loadEmployeesSuccess, (state: EmployeeState, { employees }) => ({
    ...state,
    employees: {
      ...state.employees,
      loading: false,
      result: employees,
    },
  })),
  on(loadEmployeesFailure, (state: EmployeeState, { errorMessage }) => ({
    ...state,
    employees: {
      ...state.employees,
      errorMessage,
      loading: false,
      result: [],
    },
  }))
);

const { selectAll } = filterAdapter.getSelectors();

export const selectAllSelectedEmployees = selectAll;

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: EmployeeState, action: Action): EmployeeState {
  return employeeReducer(state, action);
}
