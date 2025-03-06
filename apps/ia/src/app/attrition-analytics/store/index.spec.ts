import { Action } from '@ngrx/store';

import { CHART_COLOR_PALETTE } from '../../shared/models';
import { EmployeeAnalytics, EmployeeCluster } from '../models';
import {
  attritionAnalyticsReducer,
  AttritionAnalyticsState,
  initialState,
  reducer,
} from '.';
import {
  loadAvailableClustersFailure,
  loadAvailableClustersSuccess,
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

  describe('loadAvailableClusters', () => {
    test('should return loading state', () => {
      const action = { type: '[AttritionAnalytics] Load Available Clusters' };

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.clusters.data.loading).toBeTruthy();
    });
  });

  describe('loadAvailableClustersSuccess', () => {
    test('should unset loading and set employee clusters', () => {
      const data: EmployeeCluster[] = [
        {
          name: 'Cluster 1',
          allFeaturesCount: 20,
          color: CHART_COLOR_PALETTE.COLORFUL_CHART_1,
        },
      ];

      const action = loadAvailableClustersSuccess({ data });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.clusters.data.loading).toBeFalsy();
      expect(state.clusters.data.data).toEqual(data);
    });
  });

  describe('loadAvailableClustersFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadAvailableClustersFailure({ errorMessage });
      const fakeState: AttritionAnalyticsState = {
        ...initialState,
        clusters: {
          data: {
            data: [
              {
                name: 'Cluster 1',
                allFeaturesCount: 20,
                color: 'red',
              },
            ],
            loading: true,
            errorMessage: undefined as string,
          },
          selected: 'Cluster 1',
        },
      };

      const state = attritionAnalyticsReducer(fakeState, action);

      expect(state.clusters.data.loading).toBeFalsy();
      expect(state.clusters.data.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadEmployeeAnalytics', () => {
    test('should return loading state', () => {
      const action = { type: '[AttritionAnalytics] Load Employee Analytics' };

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.loading).toBeTruthy();
    });
  });

  describe('loadEmployeeAnalyticsSuccess', () => {
    test('should unset loading and set employee analytics', () => {
      const data: EmployeeAnalytics[] = [
        {
          feature: 'Age',
          overallFluctuationRate: 0.045,
          headcount: [50, 49, 59],
          values: ['18', '19', '20'],
          fluctuation: [2, 5, 7],
          names: ['a', 'b', 'c'],
          order: [3, 1, 2],
          totalEmployees: {
            headcount: 158,
            leavers: 7,
          },
          notApplicableEmployees: {
            headcount: 2,
            leavers: 1,
          },
        },
      ];

      const action = loadEmployeeAnalyticsSuccess({ data });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.loading).toBeFalsy();
      expect(state.employeeAnalytics.data).toEqual(data);
    });
  });

  describe('loadEmployeeAnalyticsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadEmployeeAnalyticsFailure({ errorMessage });
      const fakeState: AttritionAnalyticsState = {
        ...initialState,
        employeeAnalytics: {
          data: [
            {
              feature: 'Age',
              overallFluctuationRate: 0.045,
              headcount: [50, 49, 59],
              values: ['18', '19', '20'],
              fluctuation: [2, 5, 7],
              names: ['a', 'b', 'c'],
              order: [3, 2, 1],
              totalEmployees: {
                headcount: 158,
                leavers: 7,
              },
              notApplicableEmployees: {
                headcount: 2,
                leavers: 1,
              },
            },
          ],
          loading: true,
          errorMessage: undefined as string,
        },
      };

      const state = attritionAnalyticsReducer(fakeState, action);

      expect(state.employeeAnalytics.loading).toBeFalsy();
      expect(state.employeeAnalytics.errorMessage).toEqual(errorMessage);
    });
  });

  describe('selectCluster', () => {
    test('should set selected cluster', () => {
      const action = {
        type: '[AttritionAnalytics] Select Cluster',
        cluster: 'Personal',
      };

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.clusters.selected).toEqual('Personal');
    });
  });

  describe('clearEmployeeAnalytics', () => {
    test('should clear employee analytics', () => {
      const action = { type: '[AttritionAnalytics] Clear Employee Analytics' };
      const fakeState: AttritionAnalyticsState = {
        ...initialState,
        employeeAnalytics: {
          data: [
            {
              feature: 'Age',
              overallFluctuationRate: 0.045,
              headcount: [50, 49, 59],
              values: ['18', '19', '20'],
              fluctuation: [2, 5, 7],
              names: ['a', 'b', 'c'],
              order: [1, 3, 2],
              totalEmployees: {
                headcount: 158,
                leavers: 7,
              },
              notApplicableEmployees: {
                headcount: 2,
                leavers: 1,
              },
            },
          ],
          loading: false,
          errorMessage: undefined as string,
        },
      };

      const state = attritionAnalyticsReducer(fakeState, action);

      expect(state.employeeAnalytics.data).toBeUndefined();
    });
  });
});
