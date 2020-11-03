import { createAction, props, union } from '@ngrx/store';

export const getLoadId = createAction('[ConditionMonitoring] Load Load Id');

export const getLoad = createAction(
  '[ConditionMonitoring] Get Load',
  props<{ bearingId: string }>()
);

export const getLoadSuccess = createAction(
  '[ConditionMonitoring] Get Load Success',
  props<{ id: string; body: any }>()
);

export const getLoadFailure = createAction(
  '[ConditionMonitoring] Get Load Failure'
);

const all = union({
  getLoadId,
  getLoad,
  getLoadFailure,
  getLoadSuccess,
});

export type ConditionMonitoringActions = typeof all;
