import { createAction, props, union } from '@ngrx/store';

import {
  Employee,
  EmployeesRequest,
  InitialFiltersResponse,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';

export const loadInitialFilters = createAction(
  '[Employee] Load Initial Filters'
);

export const loadInitialFiltersSuccess = createAction(
  '[Employee] Load Initial Filters Success',
  props<{ filters: InitialFiltersResponse }>()
);

export const loadInitialFiltersFailure = createAction(
  '[Employee] Load Initial Filters Failure',
  props<{ errorMessage: string }>()
);

export const filterSelected = createAction(
  '[Employee] Filter selected',
  props<{ filter: SelectedFilter }>()
);

export const timePeriodSelected = createAction(
  '[Employee] Time period selected',
  props<{ timePeriod: TimePeriod }>()
);

export const timeRangeSelected = createAction(
  '[Employee] Time range selected',
  props<{ timeRange: string }>()
);

export const loadEmployees = createAction(
  '[Employee] Load Employees',
  props<{ request: EmployeesRequest }>()
);

export const loadEmployeesSuccess = createAction(
  '[Employee] Load Employees Success',
  props<{ employees: Employee[] }>()
);

export const loadEmployeesFailure = createAction(
  '[Employee] Load Employees Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadInitialFilters,
  loadInitialFiltersSuccess,
  loadInitialFiltersFailure,
  filterSelected,
  timePeriodSelected,
  timeRangeSelected,
  loadEmployees,
  loadEmployeesSuccess,
  loadEmployeesFailure,
});

export type SearchActions = typeof all;
