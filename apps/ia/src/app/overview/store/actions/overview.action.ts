import { createAction, props, union } from '@ngrx/store';

import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewExitEntryEmployeesResponse,
  OverviewFluctuationRates,
  ResignedEmployeesResponse,
} from '../../models';

export const loadOverviewData = createAction('[Overview] Load Overview data');

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
  '[Overview] Load FluctuationRates meta data',
  props<{ request: EmployeesRequest }>()
);

export const loadFluctuationRatesOverviewSuccess = createAction(
  '[Overview] Load FluctuationRates meta data Success',
  props<{ data: OverviewFluctuationRates }>()
);

export const loadFluctuationRatesOverviewFailure = createAction(
  '[Overview] Load FluctuationRates meta data Failure',
  props<{ errorMessage: string }>()
);

export const loadOverviewExitEmployees = createAction(
  '[Overview] Load overview exit employees'
);

export const loadOverviewExitEmployeesSuccess = createAction(
  '[Overview] Load overview exit employees Success',
  props<{ data: OverviewExitEntryEmployeesResponse }>()
);

export const loadOverviewExitEmployeesFailure = createAction(
  '[Overview] Load overview exit employees Failure',
  props<{ errorMessage: string }>()
);

export const loadOverviewEntryEmployees = createAction(
  '[Overview] Load overview entry employees'
);

export const loadOverviewEntryEmployeesSuccess = createAction(
  '[Overview] Load overview entry employees Success',
  props<{ data: OverviewExitEntryEmployeesResponse }>()
);

export const loadOverviewEntryEmployeesFailure = createAction(
  '[Overview] Load overview entry employees Failure',
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

export const loadResignedEmployees = createAction(
  '[Overview] Load Resigned Employees',
  props<{ request: EmployeesRequest }>()
);

export const loadResignedEmployeesSuccess = createAction(
  '[Overview] Load Resigned Employees Success',
  props<{ data: ResignedEmployeesResponse }>()
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
  loadResignedEmployees,
  loadResignedEmployeesSuccess,
  loadResignedEmployeesFailure,
  loadOverviewExitEmployees,
  loadOverviewExitEmployeesSuccess,
  loadOverviewExitEmployeesFailure,
  loadOverviewEntryEmployees,
  loadOverviewEntryEmployeesSuccess,
  loadOverviewEntryEmployeesFailure,
  loadOpenApplications,
  loadOpenApplicationsSuccess,
  loadOpenApplicationsFailure,
});

export type OverviewActions = typeof all;
