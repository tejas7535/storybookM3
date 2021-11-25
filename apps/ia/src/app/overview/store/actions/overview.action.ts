import { createAction, props, union } from '@ngrx/store';

import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewFluctuationRates,
  ResignedEmployee,
} from '../../models';

export const loadAttritionOverTimeOverview = createAction(
  '[Overview] Load AttritionOverTime for last three years',
  props<{ request: EmployeesRequest }>()
);

export const loadAttritionOverTimeOverviewSuccess = createAction(
  '[Overview] Load AttritionOverTime for last three years Success',
  props<{ data: AttritionOverTime }>()
);

export const loadAttritionOverTimeOverviewFailure = createAction(
  '[Overview] Load AttritionOverTime for last three years Failure',
  props<{ errorMessage: string }>()
);

export const loadFluctuationRatesOverview = createAction(
  '[Overview] Load FluctuationRates with entries and exits',
  props<{ request: EmployeesRequest }>()
);

export const loadFluctuationRatesOverviewSuccess = createAction(
  '[Overview] Load FluctuationRates with entries and exits Success',
  props<{ data: OverviewFluctuationRates }>()
);

export const loadFluctuationRatesOverviewFailure = createAction(
  '[Overview] Load FluctuationRates with entries and exits Failure',
  props<{ errorMessage: string }>()
);

export const loadFluctuationRatesChartData = createAction(
  '[Overview] Load FluctuationRatesChartData',
  props<{ request: EmployeesRequest }>()
);

export const loadFluctuationRatesChartDataSuccess = createAction(
  '[Overview] Load FluctuationRatesChartData Success',
  props<{ data: FluctuationRatesChartData }>()
);

export const loadFluctuationRatesChartDataFailure = createAction(
  '[Overview] Load FluctuationRatesChartData Failure',
  props<{ errorMessage: string }>()
);

export const loadUnforcedFluctuationRatesChartData = createAction(
  '[Overview] Load UnforcedFluctuationRatesChartData',
  props<{ request: EmployeesRequest }>()
);

export const loadUnforcedFluctuationRatesChartDataSuccess = createAction(
  '[Overview] Load UnforcedFluctuationRatesChartData Success',
  props<{ data: FluctuationRatesChartData }>()
);

export const loadUnforcedFluctuationRatesChartDataFailure = createAction(
  '[Overview] Load UnforcedFluctuationRatesChartData Failure',
  props<{ errorMessage: string }>()
);

export const loadResignedEmployees = createAction(
  '[Overview] Load Resigned Employees',
  props<{ orgUnit: string }>()
);

export const loadResignedEmployeesSuccess = createAction(
  '[Overview] Load Resigned Employees Success',
  props<{ data: ResignedEmployee[] }>()
);

export const loadResignedEmployeesFailure = createAction(
  '[Overview] Load Resigned Employees Failure',
  props<{ errorMessage: string }>()
);

export const loadOpenApplications = createAction(
  '[Overview] Load Open Applications',
  props<{ orgUnit: string }>()
);

export const loadOpenApplicationsSuccess = createAction(
  '[Overview] Load Open Applications Success',
  props<{ data: OpenApplication[] }>()
);

export const loadOpenApplicationsFailure = createAction(
  '[Overview] Load Open Applications Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewSuccess,
  loadAttritionOverTimeOverviewFailure,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewSuccess,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesChartDataFailure,
  loadUnforcedFluctuationRatesChartData,
  loadUnforcedFluctuationRatesChartDataSuccess,
  loadUnforcedFluctuationRatesChartDataFailure,
  loadResignedEmployees,
  loadResignedEmployeesSuccess,
  loadResignedEmployeesFailure,
});

export type OverviewActions = typeof all;
