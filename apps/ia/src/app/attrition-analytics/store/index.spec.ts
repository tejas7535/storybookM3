import { Action } from '@ngrx/store';

import { Slice } from '../../shared/models';
import {
  EmployeeAnalytics,
  FeatureImportanceGroup,
  FeatureImportanceType,
  FeatureParams,
} from '../models';
import { attritionAnalyticsReducer, initialState, reducer } from '.';
import {
  changeSelectedFeatures,
  loadAvailableFeatures,
  loadAvailableFeaturesFailure,
  loadAvailableFeaturesSuccess,
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsFailure,
  loadEmployeeAnalyticsSuccess,
  loadFeatureImportance,
  loadFeatureImportanceFailure,
  loadFeatureImportanceSuccess,
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
      const action = loadEmployeeAnalytics({ params: [] });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.features.loading).toBeTruthy();
    });
  });

  describe('loadEmployeeAnalyticsSuccess', () => {
    test('should save data and set loading false', () => {
      const data: EmployeeAnalytics[] = [];
      const action = loadEmployeeAnalyticsSuccess({ data });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.features.loading).toBeFalsy();
      expect(state.employeeAnalytics.features.data).toEqual(data);
    });
  });

  describe('loadEmployeeAnalyticsFailure', () => {
    test('should set error message, remove data and set loading false', () => {
      const action = loadEmployeeAnalyticsFailure({ errorMessage });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.features.loading).toBeFalsy();
      expect(state.employeeAnalytics.features.data).toBeUndefined();
      expect(state.employeeAnalytics.features.errorMessage).toEqual(
        errorMessage
      );
    });
  });

  describe('changeSelectedFeatures', () => {
    test('should set features', () => {
      const features: FeatureParams[] = [
        { feature: 'Age' } as FeatureParams,
        { feature: 'Position' } as FeatureParams,
      ];
      const action = changeSelectedFeatures({
        features,
      });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.selectedByUser.features).toBeDefined();
      expect(state.selectedByUser.features).toEqual(features);
    });
  });

  describe('loadAvailableFeatures', () => {
    test('should set loading true', () => {
      const action = loadAvailableFeatures();

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.availableFeatures.loading).toBeTruthy();
    });
  });

  describe('loadAvailableFeaturesSuccess', () => {
    test('should save data and set loading false', () => {
      const data: FeatureParams[] = [];
      const action = loadAvailableFeaturesSuccess({ data });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.availableFeatures.loading).toBeFalsy();
      expect(state.employeeAnalytics.availableFeatures.data).toEqual(data);
    });
  });

  describe('loadAvailableFeaturesFailure', () => {
    test('should set error message, remove data and set loading false', () => {
      const action = loadAvailableFeaturesFailure({ errorMessage });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.employeeAnalytics.availableFeatures.loading).toBeFalsy();
      expect(state.employeeAnalytics.availableFeatures.data).toBeUndefined();
      expect(state.employeeAnalytics.availableFeatures.errorMessage).toEqual(
        errorMessage
      );
    });
  });

  describe('loadFeatureImportance', () => {
    test('should set loading true', () => {
      const action = loadFeatureImportance();

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.featureImportance.loading).toBeTruthy();
    });
  });

  describe('loadFeatureImportanceSuccess', () => {
    test('should save data and set loading false', () => {
      const data: Slice<FeatureImportanceGroup> = {
        hasNext: true,
        hasPrevious: false,
        pageable: {
          pageNumber: 0,
          pageSize: 10,
        },
        content: [
          {
            feature: 'Test',
            type: FeatureImportanceType.NUMERIC,
            dataPoints: [
              {
                shapValue: 1,
                value: 'test a',
                yaxisPos: 18,
                colorMap: 0.3,
              },
            ],
          },
        ],
      };
      const action = loadFeatureImportanceSuccess({ data });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.featureImportance.loading).toBeFalsy();
      expect(state.featureImportance.data).toEqual(data.content);
      expect(state.featureImportance.hasNext).toEqual(data.hasNext);
      expect(state.featureImportance.pageable).toEqual(data.pageable);
    });
  });

  describe('loadFeatureImportanceFailure', () => {
    test('should set error messageand set loading false', () => {
      const action = loadFeatureImportanceFailure({ errorMessage });

      const state = attritionAnalyticsReducer(initialState, action);

      expect(state.featureImportance.loading).toBeFalsy();
      expect(state.featureImportance.errorMessage).toEqual(errorMessage);
    });
  });
});
