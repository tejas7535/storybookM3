import { createAction, props, union } from '@ngrx/store';

import { EmployeesRequest, MonthlyFluctuation } from '../../../shared/models';
import {
  ExitEntryEmployeesResponse,
  FluctuationRate,
  OpenApplication,
  OverviewWorkforceBalanceMeta,
  ResignedEmployeesResponse,
} from '../../models';

export const loadOverviewDimensionData = createAction(
  '[Overview] Load Overview Dimension data'
);

export const loadOverviewBenchmarkData = createAction(
  '[Overview] Load Overview Benchmark data'
);

export const loadAttritionOverTimeOverview = createAction(
  '[Overview] Load AttritionOverTime for last three years',
  props<{ request: EmployeesRequest }>()
);

export const loadAttritionOverTimeOverviewSuccess = createAction(
  '[Overview] Load AttritionOverTime for last three years Success',
  props<{ monthlyFluctuation: MonthlyFluctuation }>()
);

export const loadAttritionOverTimeOverviewFailure = createAction(
  '[Overview] Load AttritionOverTime for last three years Failure',
  props<{ errorMessage: string }>()
);

export const loadWorkforceBalanceMeta = createAction(
  '[Overview] Load workforce balance meta',
  props<{ request: EmployeesRequest }>()
);

export const loadWorkforceBalanceMetaSuccess = createAction(
  '[Overview] Load workforce balance meta Success',
  props<{ data: OverviewWorkforceBalanceMeta }>()
);

export const loadWorkforceBalanceMetaFailure = createAction(
  '[Overview] Load workforce balance meta Failure',
  props<{ errorMessage: string }>()
);

export const loadFluctuationRates = createAction(
  '[Overview] Load FluctuationRates',
  props<{ request: EmployeesRequest }>()
);

export const loadFluctuationRatesSuccess = createAction(
  '[Overview] Load FluctuationRates Success',
  props<{ data: FluctuationRate }>()
);

export const loadFluctuationRatesFailure = createAction(
  '[Overview] Load FluctuationRates Failure',
  props<{ errorMessage: string }>()
);

export const loadBenchmarkFluctuationRates = createAction(
  '[Overview] Load Benchmark FluctuationRates',
  props<{ request: EmployeesRequest }>()
);

export const loadBenchmarkFluctuationRatesSuccess = createAction(
  '[Overview] Load Benchmark FluctuationRates Success',
  props<{ data: FluctuationRate }>()
);

export const loadBenchmarkFluctuationRatesFailure = createAction(
  '[Overview] Load Benchmark FluctuationRates Failure',
  props<{ errorMessage: string }>()
);

export const clearOverviewDimensionData = createAction(
  '[Overview] Clear Overview Dimension data'
);

export const clearOverviewBenchmarkData = createAction(
  '[Overview] Clear Overview Benchmark data'
);

export const loadOverviewExitEmployees = createAction(
  '[Overview] Load overview exit employees'
);

export const loadOverviewExitEmployeesSuccess = createAction(
  '[Overview] Load overview exit employees Success',
  props<{ data: ExitEntryEmployeesResponse }>()
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
  props<{ data: ExitEntryEmployeesResponse }>()
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
  props<{ monthlyFluctuation: MonthlyFluctuation }>()
);

export const loadFluctuationRatesChartDataFailure = createAction(
  '[Overview] Load FluctuationRatesChartData Failure',
  props<{ errorMessage: string }>()
);

export const loadBenchmarkFluctuationRatesChartData = createAction(
  '[Overview] Load Benchmark FluctuationRatesChartData',
  props<{ request: EmployeesRequest }>()
);

export const loadBenchmarkFluctuationRatesChartDataSuccess = createAction(
  '[Overview] Load Benchmark FluctuationRatesChartData Success',
  props<{ monthlyFluctuation: MonthlyFluctuation }>()
);

export const loadBenchmarkFluctuationRatesChartDataFailure = createAction(
  '[Overview] Load Benchmark FluctuationRatesChartData Failure',
  props<{ errorMessage: string }>()
);

export const loadResignedEmployees = createAction(
  '[Overview] Load Resigned Employees'
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
  '[Overview] Load Open Applications'
);

export const loadOpenApplicationsSuccess = createAction(
  '[Overview] Load Open Applications Success',
  props<{ data: OpenApplication[] }>()
);

export const loadOpenApplicationsFailure = createAction(
  '[Overview] Load Open Applications Failure',
  props<{ errorMessage: string }>()
);

export const loadOpenApplicationsCount = createAction(
  '[Overview] Load Open Applications Count',
  props<{ request: EmployeesRequest }>()
);

export const loadOpenApplicationsCountSuccess = createAction(
  '[Overview] Load Open Applications Count Success',
  props<{ openApplicationsCount: number }>()
);

export const loadOpenApplicationsCountFailure = createAction(
  '[Overview] Load Open Applications Count Failure',
  props<{ errorMessage: string }>()
);

export const loadAttritionOverTimeEmployees = createAction(
  '[Overview] Load Attrition Over Time Employees',
  props<{ timeRange: string }>()
);

export const loadAttritionOverTimeEmployeesSuccess = createAction(
  '[Overview] Load Attrition Over Time Employees Success',
  props<{ data: ExitEntryEmployeesResponse }>()
);

export const loadAttritionOverTimeEmployeesFailure = createAction(
  '[Overview] Load Attrition Over Time Employees Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadFluctuationRates,
  loadFluctuationRatesSuccess,
  loadFluctuationRatesFailure,
  loadBenchmarkFluctuationRates,
  loadBenchmarkFluctuationRatesSuccess,
  loadBenchmarkFluctuationRatesFailure,
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewSuccess,
  loadAttritionOverTimeOverviewFailure,
  loadWorkforceBalanceMeta,
  loadWorkforceBalanceMetaSuccess,
  loadWorkforceBalanceMetaFailure,
  clearOverviewDimensionData,
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
  loadOpenApplicationsCount,
  loadOpenApplicationsCountSuccess,
});

export type OverviewActions = typeof all;
