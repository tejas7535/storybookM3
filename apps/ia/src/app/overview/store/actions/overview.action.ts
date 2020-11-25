import { createAction, props, union } from '@ngrx/store';

import { Employee, EmployeesRequest } from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';

export const initOverview = createAction('[Overview] Init');

export const chartTypeSelected = createAction(
  '[Overview] Chart type selected',
  props<{ chartType: ChartType }>()
);

export const loadOrgChart = createAction(
  '[Overview] Load Org Chart',
  props<{ request: EmployeesRequest }>()
);

export const loadOrgChartSuccess = createAction(
  '[Overview] Load Org Chart Success',
  props<{ employees: Employee[] }>()
);

export const loadOrgChartFailure = createAction(
  '[Overview] Load Org Chart Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  initOverview,
  chartTypeSelected,
  loadOrgChart,
  loadOrgChartSuccess,
  loadOrgChartFailure,
});

export type OverviewActions = typeof all;
