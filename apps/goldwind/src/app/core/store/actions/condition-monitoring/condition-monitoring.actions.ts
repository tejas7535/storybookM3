import { createAction, props, union } from '@ngrx/store';

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
  connectStomp,
  disconnectStomp,
  getStompStatus,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
});

export type ConditionMonitoringActions = typeof all;
