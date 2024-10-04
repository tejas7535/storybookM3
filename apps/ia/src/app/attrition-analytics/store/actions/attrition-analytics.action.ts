import { createAction, props, union } from '@ngrx/store';

import { EmployeeCluster } from '../../models';

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

const all = union({
  loadAvailableClusters,
  loadAvailableClustersSuccess,
  loadAvailableClustersFailure,
});

export type AttritionAnalyticsActions = typeof all;
