import { EmployeesRequest, MonthlyFluctuation } from '../../../shared/models';
import {
  ExitEntryEmployeesResponse,
  FluctuationRate,
  OpenApplication,
  OverviewWorkforceBalanceMeta,
  ResignedEmployeesResponse,
} from '../../models';
import {
  clearOverviewBenchmarkData,
  clearOverviewDimensionData,
  loadAttritionOverTimeEmployees,
  loadAttritionOverTimeEmployeesFailure,
  loadAttritionOverTimeEmployeesSuccess,
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadBenchmarkFluctuationRatesChartData,
  loadBenchmarkFluctuationRatesChartDataFailure,
  loadBenchmarkFluctuationRatesChartDataSuccess,
  loadFluctuationRates,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesFailure,
  loadFluctuationRatesSuccess,
  loadOpenApplications,
  loadOpenApplicationsCount,
  loadOpenApplicationsCountFailure,
  loadOpenApplicationsCountSuccess,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
  loadOverviewBenchmarkData,
  loadOverviewDimensionData,
  loadOverviewEntryEmployees,
  loadOverviewEntryEmployeesFailure,
  loadOverviewEntryEmployeesSuccess,
  loadOverviewExitEmployees,
  loadOverviewExitEmployeesFailure,
  loadOverviewExitEmployeesSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
  loadWorkforceBalanceMeta,
  loadWorkforceBalanceMetaFailure,
  loadWorkforceBalanceMetaSuccess,
} from './overview.action';

describe('Overview Actions', () => {
  const errorMessage = 'An error occured';

  test('loadOverviewDimensionData', () => {
    const action = loadOverviewDimensionData();

    expect(action).toEqual({
      type: '[Overview] Load Overview Dimension data',
    });
  });

  test('loadOverviewBenchmarkData', () => {
    const action = loadOverviewBenchmarkData();

    expect(action).toEqual({
      type: '[Overview] Load Overview Benchmark data',
    });
  });

  test('loadAttritionOverTimeOverview', () => {
    const orgUnit = 'ABC';
    const action = loadAttritionOverTimeOverview({
      request: { value: orgUnit } as EmployeesRequest,
    });

    expect(action).toEqual({
      request: { value: orgUnit },
      type: '[Overview] Load AttritionOverTime for last three years',
    });
  });

  test('loadAttritionOverTimeOverviewSuccess', () => {
    const monthlyFluctuation: MonthlyFluctuation = {
      fluctuationRates: [1, 2, 3],
    } as MonthlyFluctuation;

    const action = loadAttritionOverTimeOverviewSuccess({
      monthlyFluctuation,
    });

    expect(action).toEqual({
      monthlyFluctuation,
      type: '[Overview] Load AttritionOverTime for last three years Success',
    });
  });

  test('loadAttritionOverTimeOverviewFailure', () => {
    const action = loadAttritionOverTimeOverviewFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load AttritionOverTime for last three years Failure',
    });
  });

  test('loadWorkforceBalanceMeta', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadWorkforceBalanceMeta({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load workforce balance meta',
    });
  });

  test('loadWorkforceBalanceMetaSuccess', () => {
    const data = {} as unknown as OverviewWorkforceBalanceMeta;
    const action = loadWorkforceBalanceMetaSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[Overview] Load workforce balance meta Success',
    });
  });

  test('loadWorkforceBalanceMetaFailure', () => {
    const action = loadWorkforceBalanceMetaFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load workforce balance meta Failure',
    });
  });

  test('loadFluctuationRates', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadFluctuationRates({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load FluctuationRates',
    });
  });

  test('loadFluctuationRatesSuccess', () => {
    const data = {} as unknown as FluctuationRate;
    const action = loadFluctuationRatesSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[Overview] Load FluctuationRates Success',
    });
  });

  test('loadFluctuationRatesFailure', () => {
    const action = loadFluctuationRatesFailure({
      errorMessage,
    });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load FluctuationRates Failure',
    });
  });

  test('clearOverviewDimensionData', () => {
    const action = clearOverviewDimensionData();

    expect(action).toEqual({
      type: '[Overview] Clear Overview Dimension data',
    });
  });

  test('clearOverviewBenchmarkData', () => {
    const action = clearOverviewBenchmarkData();

    expect(action).toEqual({
      type: '[Overview] Clear Overview Benchmark data',
    });
  });

  test('loadFluctuationRatesChartData', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadFluctuationRatesChartData({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load FluctuationRatesChartData',
    });
  });

  test('loadFluctuationRatesChartDataSuccess', () => {
    const monthlyFluctuation: MonthlyFluctuation = {
      fluctuationRates: [1, 2, 3],
    } as MonthlyFluctuation;
    const action = loadFluctuationRatesChartDataSuccess({ monthlyFluctuation });

    expect(action).toEqual({
      monthlyFluctuation,
      type: '[Overview] Load FluctuationRatesChartData Success',
    });
  });

  test('loadFluctuationRatesChartDataFailure', () => {
    const action = loadFluctuationRatesChartDataFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load FluctuationRatesChartData Failure',
    });
  });

  test('loadBenchmarkFluctuationRatesChartData', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadBenchmarkFluctuationRatesChartData({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load Benchmark FluctuationRatesChartData',
    });
  });

  test('loadBenchmarkFluctuationRatesChartDataSuccess', () => {
    const monthlyFluctuation: MonthlyFluctuation = {
      fluctuationRates: [1, 2, 3],
    } as MonthlyFluctuation;
    const action = loadBenchmarkFluctuationRatesChartDataSuccess({
      monthlyFluctuation,
    });

    expect(action).toEqual({
      monthlyFluctuation,
      type: '[Overview] Load Benchmark FluctuationRatesChartData Success',
    });
  });

  test('loadBenchmarkFluctuationRatesChartDataFailure', () => {
    const action = loadBenchmarkFluctuationRatesChartDataFailure({
      errorMessage,
    });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load Benchmark FluctuationRatesChartData Failure',
    });
  });

  test('loadResignedEmployees', () => {
    const action = loadResignedEmployees();

    expect(action).toEqual({
      type: '[Overview] Load Resigned Employees',
    });
  });

  test('loadResignedEmployeesSuccess', () => {
    const data: ResignedEmployeesResponse = {
      employees: [],
      resignedEmployeesCount: 5,
      responseModified: true,
      synchronizedOn: '123',
    };
    const action = loadResignedEmployeesSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Overview] Load Resigned Employees Success',
    });
  });

  test('loadResignedEmployeesFailure', () => {
    const action = loadResignedEmployeesFailure({
      errorMessage,
    });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load Resigned Employees Failure',
    });
  });

  test('loadOpenApplications', () => {
    const action = loadOpenApplications();

    expect(action).toEqual({
      type: '[Overview] Load Open Applications',
    });
  });

  test('loadOpenApplicationsSuccess', () => {
    const data: OpenApplication[] = [
      {
        isExternal: true,
        isInternal: true,
        approvalDate: '123',
        count: 4,
        name: 'Best Job',
      },
    ];
    const action = loadOpenApplicationsSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Overview] Load Open Applications Success',
    });
  });

  test('loadOpenApplicationsFailure', () => {
    const action = loadOpenApplicationsFailure({
      errorMessage,
    });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load Open Applications Failure',
    });
  });

  test('loadOverviewEntryEmployees', () => {
    const action = loadOverviewEntryEmployees();

    expect(action).toEqual({
      type: '[Overview] Load overview entry employees',
    });
  });

  test('loadOverviewEntryEmployeesSuccess', () => {
    const data: ExitEntryEmployeesResponse = {
      employees: [],
      responseModified: true,
    };
    const action = loadOverviewEntryEmployeesSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Overview] Load overview entry employees Success',
    });
  });

  test('loadOverviewEntryEmployeesFailure', () => {
    const action = loadOverviewEntryEmployeesFailure({
      errorMessage,
    });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load overview entry employees Failure',
    });
  });
  test('loadOverviewExitEmployees', () => {
    const action = loadOverviewExitEmployees();

    expect(action).toEqual({
      type: '[Overview] Load overview exit employees',
    });
  });

  test('loadOverviewExitEmployeesSuccess', () => {
    const data: ExitEntryEmployeesResponse = {
      employees: [],
      responseModified: true,
    };
    const action = loadOverviewExitEmployeesSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Overview] Load overview exit employees Success',
    });
  });

  test('loadOverviewExitEmployeesFailure', () => {
    const action = loadOverviewExitEmployeesFailure({
      errorMessage,
    });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load overview exit employees Failure',
    });
  });

  test('loadOpenApplicationsCount', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadOpenApplicationsCount({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load Open Applications Count',
    });
  });

  test('loadOpenApplicationsCountSuccess', () => {
    const openApplicationsCount = 5;

    const action = loadOpenApplicationsCountSuccess({ openApplicationsCount });

    expect(action).toEqual({
      openApplicationsCount,
      type: '[Overview] Load Open Applications Count Success',
    });
  });

  test('loadOpenApplicationsCountFailure', () => {
    const action = loadOpenApplicationsCountFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load Open Applications Count Failure',
    });
  });

  test('loadAttritionOverTimeEmployees', () => {
    const timeRange = '1-1';
    const action = loadAttritionOverTimeEmployees({ timeRange });

    expect(action).toEqual({
      type: '[Overview] Load Attrition Over Time Employees',
      timeRange,
    });
  });

  test('loadAttritionOverTimeEmployeesSuccess', () => {
    const data: ExitEntryEmployeesResponse = {
      employees: [],
      responseModified: true,
    };
    const action = loadAttritionOverTimeEmployeesSuccess({ data });

    expect(action).toEqual({
      type: '[Overview] Load Attrition Over Time Employees Success',
      data,
    });
  });

  test('loadAttritionOverTimeEmployeesFailure', () => {
    const action = loadAttritionOverTimeEmployeesFailure({ errorMessage });

    expect(action).toEqual({
      type: '[Overview] Load Attrition Over Time Employees Failure',
      errorMessage,
    });
  });
});
