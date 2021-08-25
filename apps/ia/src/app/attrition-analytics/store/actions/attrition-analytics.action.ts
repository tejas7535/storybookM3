import { createAction, props } from '@ngrx/store';

import { EmployeeAnalytics } from '../../models/employee-analytics.model';

export const loadEmployeeAnalytics = createAction(
  '[AttritionAnalytics] Load Employee Analytics'
);

export const loadEmployeeAnalyticsSuccess = createAction(
  '[AttritionAnalytics] Load Employee Analytics Success',
  props<{ data: EmployeeAnalytics }>()
);

export const loadEmployeeAnalyticsFailure = createAction(
  '[AttritionAnalytics] Load Employee Analytics Failure',
  props<{ errorMessage: string }>()
);

export const changeSelectedFeatures = createAction(
  '[AttritionAnalytics] Change Selected Features',
  props<{ features: string[] }>()
);
