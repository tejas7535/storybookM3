import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import {
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
} from './attrition-analytics.action';

describe('Attrition Analytics Actions', () => {
  const errorMessage = 'An error occured';

  test('loadEmployeeAnalytics', () => {
    const action = loadEmployeeAnalytics();

    expect(action).toEqual({
      type: '[AttritionAnalytics] Load Employee Analytics',
    });
  });

  test('loadEmployeeAnalyticsSuccess', () => {
    const data: EmployeeAnalytics = {} as EmployeeAnalytics;
    const action = loadEmployeeAnalyticsSuccess({ data });

    expect(action).toEqual({
      type: '[AttritionAnalytics] Load Employee Analytics Success',
      data,
    });
  });

  test('loadEmployeeAnalyticsFailure', () => {
    const action = loadEmployeeAnalyticsFailure({ errorMessage });

    expect(action).toEqual({
      type: '[AttritionAnalytics] Load Employee Analytics Failure',
      errorMessage,
    });
  });
});
