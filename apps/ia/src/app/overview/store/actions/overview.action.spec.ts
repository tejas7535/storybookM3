import { Employee, EmployeesRequest } from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import {
  chartTypeSelected,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
} from './overview.action';

describe('Overview Actions', () => {
  const errorMessage = 'An error occured';

  test('chartTypeSelected', () => {
    const chartType = ChartType.HEAT_MAP;
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
    const employees: Employee[] = [];

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
});
