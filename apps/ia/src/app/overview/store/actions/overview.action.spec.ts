import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import {
  FluctuationRatesChartData,
  OverviewFluctuationRates,
  ResignedEmployee,
} from '../../models';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
  loadUnforcedFluctuationRatesChartData,
  loadUnforcedFluctuationRatesChartDataFailure,
  loadUnforcedFluctuationRatesChartDataSuccess,
} from './overview.action';

describe('Overview Actions', () => {
  const errorMessage = 'An error occured';

  test('loadAttritionOverTimeOverview', () => {
    const orgUnit = 'ABC';
    const action = loadAttritionOverTimeOverview({ orgUnit });

    expect(action).toEqual({
      orgUnit,
      type: '[Overview] Load AttritionOverTime for last three years',
    });
  });

  test('loadAttritionOverTimeOverviewSuccess', () => {
    const data: AttritionOverTime = {} as unknown as AttritionOverTime;

    const action = loadAttritionOverTimeOverviewSuccess({
      data,
    });

    expect(action).toEqual({
      data,
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

  test('loadFluctuationRatesOverview', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadFluctuationRatesOverview({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load FluctuationRates with entries and exits',
    });
  });

  test('loadFluctuationRatesOverviewSuccess', () => {
    const data = {} as unknown as OverviewFluctuationRates;
    const action = loadFluctuationRatesOverviewSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[Overview] Load FluctuationRates with entries and exits Success',
    });
  });

  test('loadFluctuationRatesOverviewFailure', () => {
    const action = loadFluctuationRatesOverviewFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load FluctuationRates with entries and exits Failure',
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
    const data = {} as FluctuationRatesChartData;
    const action = loadFluctuationRatesChartDataSuccess({ data });

    expect(action).toEqual({
      data,
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

  test('loadUnforcedFluctuationRatesChartData', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadUnforcedFluctuationRatesChartData({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load UnforcedFluctuationRatesChartData',
    });
  });

  test('loadUnforcedFluctuationRatesChartDataSuccess', () => {
    const data = {} as FluctuationRatesChartData;
    const action = loadUnforcedFluctuationRatesChartDataSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Overview] Load UnforcedFluctuationRatesChartData Success',
    });
  });

  test('loadUnforcedFluctuationRatesChartDataFailure', () => {
    const action = loadUnforcedFluctuationRatesChartDataFailure({
      errorMessage,
    });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load UnforcedFluctuationRatesChartData Failure',
    });
  });

  test('loadResignedEmployees', () => {
    const orgUnit = 'ABC123';
    const action = loadResignedEmployees({ orgUnit });

    expect(action).toEqual({
      orgUnit,
      type: '[Overview] Load Resigned Employees',
    });
  });

  test('loadResignedEmployeesSuccess', () => {
    const data: ResignedEmployee[] = [];
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
});
