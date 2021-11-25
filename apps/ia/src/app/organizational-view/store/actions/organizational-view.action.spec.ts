import {
  AttritionOverTime,
  Employee,
  EmployeesRequest,
} from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  chartTypeSelected,
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from './organizational-view.action';

describe('Organizational View Actions', () => {
  const errorMessage = 'An error occured';

  test('chartTypeSelected', () => {
    const chartType = ChartType.WORLD_MAP;
    const action = chartTypeSelected({ chartType });

    expect(action).toEqual({
      chartType,
      type: '[Organizational View] Chart type selected',
    });
  });
  test('loadOrgChart', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadOrgChart({ request });

    expect(action).toEqual({
      request,
      type: '[Organizational View] Load Org Chart',
    });
  });

  test('loadOrgChartSuccess', () => {
    const employees: Employee[] = [];

    const action = loadOrgChartSuccess({ employees });

    expect(action).toEqual({
      employees,
      type: '[Organizational View] Load Org Chart Success',
    });
  });

  test('loadOrgChartFailure', () => {
    const action = loadOrgChartFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load Org Chart Failure',
    });
  });

  test('loadWorldMap', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadWorldMap({ request });

    expect(action).toEqual({
      request,
      type: '[Organizational View] Load World Map',
    });
  });

  test('loadWorldMapSuccess', () => {
    const data: CountryData[] = [];

    const action = loadWorldMapSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load World Map Success',
    });
  });

  test('loadWorldMapFailure', () => {
    const action = loadWorldMapFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load World Map Failure',
    });
  });

  test('loadParent', () => {
    const employee = {
      orgUnit: 'Schaeffler_IT',
      employeeId: '123',
    } as unknown as Employee;

    const action = loadParent({ employee });

    expect(action).toEqual({
      employee,
      type: '[Organizational View] Load Parent',
    });
  });

  test('loadParentSuccess', () => {
    const employee = {
      orgUnit: 'Schaeffler_IT',
      employeeId: '123',
    } as unknown as Employee;

    const action = loadParentSuccess({ employee });

    expect(action).toEqual({
      employee,
      type: '[Organizational View] Load Parent Success',
    });
  });

  test('loadParentFailure', () => {
    const action = loadParentFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load Parent Failure',
    });
  });

  test('loadAttritionOverTimeOrgChart', () => {
    const request = {} as unknown as EmployeesRequest;

    const action = loadAttritionOverTimeOrgChart({ request });

    expect(action).toEqual({
      request,
      type: '[Organizational View] Load AttritionOverTime for plus minus three months',
    });
  });

  test('loadAttritionOverTimeOrgChartSuccess', () => {
    const data = {} as unknown as AttritionOverTime;

    const action = loadAttritionOverTimeOrgChartSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load AttritionOverTime for plus minus three months Success',
    });
  });

  test('loadAttritionOverTimeOrgChartFailure', () => {
    const action = loadAttritionOverTimeOrgChartFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load AttritionOverTime for plus minus three months Failure',
    });
  });
});
