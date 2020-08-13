import { createAction, props, union } from '@ngrx/store';

import { Edm } from '../../reducers/condition-monitoring/models';

export const getEdmId = createAction(
  '[ConditionMonitoring] Load EDM Sensor ID'
);

export const getEdm = createAction(
  '[ConditionMonitoring] Load EDM',
  props<{ sensorId: string }>()
);

export const getEdmSuccess = createAction(
  '[ConditionMonitoring] Load EDM Success',
  props<{ measurements: Edm }>()
);

export const getEdmFailure = createAction(
  '[ConditionMonitoring] Load EDM Failure'
);

export const connectStomp = createAction(
  '[ConditionMonitoring] Establish Stomp Connection'
);

export const disconnectStomp = createAction(
  '[ConditionMonitoring] End Stomp Connection'
);

export const getStompStatus = createAction(
  '[ConditionMonitoring] Establish Stomp Connection Status',
  props<{ status: number }>()
);

export const subscribeBroadcast = createAction(
  '[ConditionMonitoring] Subscribe Broadcast'
);

export const subscribeBroadcastSuccess = createAction(
  '[ConditionMonitoring] Subscribe Broadcast Success',
  props<{ id: string; body: any }>()
);

const all = union({
  getEdmId,
  getEdm,
  getEdmSuccess,
  getEdmFailure,
  connectStomp,
  disconnectStomp,
  getStompStatus,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
});

export type ConditionMonitoringActions = typeof all;
