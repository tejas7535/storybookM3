import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewExitEntryEmployeesResponse,
  OverviewFluctuationRates,
  ResignedEmployeesResponse,
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
  loadOpenApplications,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
  loadOverviewEntryEmployees,
  loadOverviewEntryEmployeesFailure,
  loadOverviewEntryEmployeesSuccess,
  loadOverviewExitEmployees,
  loadOverviewExitEmployeesFailure,
  loadOverviewExitEmployeesSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
} from './overview.action';

describe('Overview Actions', () => {
  const errorMessage = 'An error occured';

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
      type: '[Overview] Load FluctuationRates meta data',
    });
  });

  test('loadFluctuationRatesOverviewSuccess', () => {
    const data = {} as unknown as OverviewFluctuationRates;
    const action = loadFluctuationRatesOverviewSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[Overview] Load FluctuationRates meta data Success',
    });
  });

  test('loadFluctuationRatesOverviewFailure', () => {
    const action = loadFluctuationRatesOverviewFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load FluctuationRates meta data Failure',
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

  test('loadResignedEmployees', () => {
    const request = { request: { value: 'AVC' } as EmployeesRequest };
    const action = loadResignedEmployees(request);

    expect(action).toEqual({
      ...request,
      type: '[Overview] Load Resigned Employees',
    });
  });

  test('loadResignedEmployeesSuccess', () => {
    const data: ResignedEmployeesResponse = {
      employees: [],
      resignedEmployeesCount: 5,
      responseModified: true,
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
    const orgUnit = { orgUnit: 'Schaeffler IT' };
    const action = loadOpenApplications(orgUnit);

    expect(action).toEqual({
      ...orgUnit,
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
    const data: OverviewExitEntryEmployeesResponse = {
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
    const data: OverviewExitEntryEmployeesResponse = {
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
});
