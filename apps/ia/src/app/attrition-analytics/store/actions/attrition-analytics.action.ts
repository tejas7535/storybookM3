import { createAction, props, union } from '@ngrx/store';

import { EmployeeAnalytics, EmployeeCluster } from '../../models';

export const loadAvailableClusters = createAction(
  '[AttritionAnalytics] Load Available Clusters'
);

export const loadAvailableClustersSuccess = createAction(
  '[AttritionAnalytics] Load Available Clusters Success',
  props<{ data: EmployeeCluster[] }>()
);

export const loadAvailableClustersFailure = createAction(
  '[AttritionAnalytics] Load Available Clusters Failure',
  props<{ errorMessage: string }>()
);

export const loadEmployeeAnalytics = createAction(
  '[AttritionAnalytics] Load Employee Analytics'
);

export const loadEmployeeAnalyticsSuccess = createAction(
  '[AttritionAnalytics] Load Employee Analytics Success',
  props<{ data: EmployeeAnalytics[] }>()
);

export const loadEmployeeAnalyticsFailure = createAction(
  '[AttritionAnalytics] Load Employee Analytics Failure',
  props<{ errorMessage: string }>()
);

export const selectCluster = createAction(
  '[AttritionAnalytics] Select Cluster',
  props<{ cluster: string }>()
);

export const clearEmployeeAnalytics = createAction(
  '[AttritionAnalytics] Clear Employee Analytics'
);

const all = union({
  loadAvailableClusters,
  loadAvailableClustersSuccess,
  loadAvailableClustersFailure,
});

export type AttritionAnalyticsActions = typeof all;
