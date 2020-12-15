import { EmployeesRequest } from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import { OrgChartEmployee } from '../../org-chart/models/org-chart-employee.model';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  chartTypeSelected,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from './overview.action';

describe('Overview Actions', () => {
  const errorMessage = 'An error occured';

  test('chartTypeSelected', () => {
    const chartType = ChartType.WORLD_MAP;
    const action = chartTypeSelected({ chartType });

    expect(action).toEqual({
      chartType,
      type: '[Overview] Chart type selected',
    });
  });
  test('loadOrgChart', () => {
    const request = ({} as unknown) as EmployeesRequest;
    const action = loadOrgChart({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load Org Chart',
    });
  });

  test('loadOrgChartSuccess', () => {
    const employees: OrgChartEmployee[] = [];

    const action = loadOrgChartSuccess({ employees });

    expect(action).toEqual({
      employees,
      type: '[Overview] Load Org Chart Success',
    });
  });

  test('loadOrgChartFailure', () => {
    const action = loadOrgChartFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load Org Chart Failure',
    });
  });

  test('loadWorldMap', () => {
    const request = ({} as unknown) as EmployeesRequest;
    const action = loadWorldMap({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load World Map',
    });
  });

  test('loadWorldMapSuccess', () => {
    const data: CountryData[] = [];

    const action = loadWorldMapSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Overview] Load World Map Success',
    });
  });

  test('loadWorldMapFailure', () => {
    const action = loadWorldMapFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load World Map Failure',
    });
  });

  test('loadParent', () => {
    const employee = ({
      orgUnit: 'Schaeffler_IT',
      employeeId: '123',
    } as unknown) as OrgChartEmployee;

    const action = loadParent({ employee });

    expect(action).toEqual({
      employee,
      type: '[Overview] Load Parent',
    });
  });

  test('loadParentSuccess', () => {
    const employee = ({
      orgUnit: 'Schaeffler_IT',
      employeeId: '123',
    } as unknown) as OrgChartEmployee;

    const action = loadParentSuccess({ employee });

    expect(action).toEqual({
      employee,
      type: '[Overview] Load Parent Success',
    });
  });

  test('loadParentFailure', () => {
    const action = loadParentFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load Parent Failure',
    });
  });
});
