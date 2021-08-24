import { Action } from '@ngrx/store';

import { attritionAnalyticsReducer, initialState, reducer } from '.';
import { EmployeeAnalytics } from '../models/employee-analytics.model';
import {
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
} from './actions/attrition-analytics.action';

describe('Attrition Analytics Reducer', () => {
  const errorMessage = 'An error occured';

  test('should return attritionAnalyticsReducer', () => {
    const action: Action = { type: 'Test' };
    expect(reducer(initialState, action)).toEqual(
      attritionAnalyticsReducer(initialState, action)
    );
  });

  describe('loadEmployeeAnalytics', () => {
    test('should set loading true', () => {
      const action = loadEmployeeAnalytics();

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.loading).toBeTruthy();
    });
  });

  describe('loadEmployeeAnalyticsSuccess', () => {
    test('should set loading true', () => {
      const data: EmployeeAnalytics = {} as EmployeeAnalytics;
      const action = loadEmployeeAnalyticsSuccess({ data });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.loading).toBeFalsy();
      expect(state.employeeAnalytics.data).toEqual(data);
    });
  });

  describe('loadEmployeeAnalyticsFailure', () => {
    test('should set loading true', () => {
      const action = loadEmployeeAnalyticsFailure({ errorMessage });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.loading).toBeFalsy();
      expect(state.employeeAnalytics.data).toBeUndefined();
      expect(state.employeeAnalytics.errorMessage).toEqual(errorMessage);
    });
  });
});
