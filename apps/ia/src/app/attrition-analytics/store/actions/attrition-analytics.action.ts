import { createAction, props } from '@ngrx/store';

import { EmployeeAnalytics } from '../../models/employee-analytics.model';
import { FeatureParams } from '../../models/feature-params.model';

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

export const changeOrderOfFeatures = createAction(
  '[AttritionAnalytics] Change Order Of Features',
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
