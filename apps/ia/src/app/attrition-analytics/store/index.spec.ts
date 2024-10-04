import { Action } from '@ngrx/store';

import { EmployeeCluster } from '../models';
import {
  attritionAnalyticsReducer,
  AttritionAnalyticsState,
  initialState,
  reducer,
} from '.';
import {
  loadAvailableClustersFailure,
  loadAvailableClustersSuccess,
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
        { name: 'Cluster 1', allFeatures: 20, availableFeatures: 10 },
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
              { name: 'Cluster 1', allFeatures: 20, availableFeatures: 10 },
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
});
