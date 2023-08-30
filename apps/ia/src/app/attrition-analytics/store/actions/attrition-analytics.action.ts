import { createAction, props, union } from '@ngrx/store';

import { Slice } from '../../../shared/models';
import {
  EmployeeAnalytics,
  FeatureImportanceGroup,
  FeatureParams,
} from '../../models';

export const selectRegion = createAction(
  '[AttritionAnalytics] Select Region',
  props<{ selectedRegion: string }>()
);

export const loadEmployeeAnalytics = createAction(
  '[AttritionAnalytics] Load Employee Analytics',
  props<{ params: FeatureParams[] }>()
);

export const loadEmployeeAnalyticsSuccess = createAction(
  '[AttritionAnalytics] Load Employee Analytics Success',
  props<{ data: EmployeeAnalytics[] }>()
);

export const loadEmployeeAnalyticsFailure = createAction(
  '[AttritionAnalytics] Load Employee Analytics Failure',
  props<{ errorMessage: string }>()
);

export const changeSelectedFeatures = createAction(
  '[AttritionAnalytics] Change Selected Features',
  props<{ features: FeatureParams[] }>()
);

export const initializeSelectedFeatures = createAction(
  '[AttritionAnalytics] Initialize Selected Features',
  props<{ features: FeatureParams[] }>()
);

export const loadAvailableFeatures = createAction(
  '[AttritionAnalytics] Load Available Features'
);

export const loadAvailableFeaturesSuccess = createAction(
  '[AttritionAnalytics] Load Available Features Success',
  props<{ data: FeatureParams[] }>()
);

export const loadAvailableFeaturesFailure = createAction(
  '[AttritionAnalytics] Load Available Features Failure',
  props<{ errorMessage: string }>()
);

export const loadFeatureImportance = createAction(
  '[AttritionAnalytics] Load Feature Importance'
);

export const loadFeatureImportanceSuccess = createAction(
  '[AttritionAnalytics] Load Feature Importance Success',
  props<{ data: Slice<FeatureImportanceGroup> }>()
);

export const loadFeatureImportanceFailure = createAction(
  '[AttritionAnalytics] Load Feature Importance Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadEmployeeAnalytics,
  loadEmployeeAnalyticsSuccess,
  loadEmployeeAnalyticsFailure,
  loadAvailableFeatures,
  loadAvailableFeaturesSuccess,
  loadAvailableFeaturesFailure,
  changeSelectedFeatures,
  initializeSelectedFeatures,
  loadFeatureImportance,
  loadFeatureImportanceSuccess,
  loadFeatureImportanceFailure,
});

export type AttritionAnalyticsActions = typeof all;
