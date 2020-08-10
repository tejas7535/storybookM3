import { createAction, props, union } from '@ngrx/store';

import { Edm, IotThing } from '../../reducers/thing/models';

export const getThingId = createAction('[Thing] Load Thing ID');

export const getThing = createAction(
  '[Thing] Load Thing',
  props<{ thingId: number }>()
);

export const getThingSuccess = createAction(
  '[Thing] Load Thing Success',
  props<{ thing: IotThing }>()
);

export const getThingFailure = createAction('[Thing] Load Thing Failure');

export const getThingEdmId = createAction('[Thing] Load Thing EDM Sensor ID');

export const getThingEdm = createAction(
  '[Thing] Load Thing EDM',
  props<{ sensorId: string }>()
);

export const getThingEdmSuccess = createAction(
  '[Thing] Load Thing EDM Success',
  props<{ measurements: Edm }>()
);

export const getThingEdmFailure = createAction(
  '[Thing] Load Thing EDM Failure'
);

export const connectStomp = createAction('[Thing] Establish Stomp Connection');

export const disconnectStomp = createAction('[Thing] End Stomp Connection');

export const getStompStatus = createAction(
  '[Thing] Establish Stomp Connection Status',
  props<{ status: number }>()
);

export const subscribeBroadcast = createAction('[Thing] Subscribe Broadcast');

export const subscribeBroadcastSuccess = createAction(
  '[Thing] Subscribe Broadcast Success',
  props<{ id: string; body: any }>()
);

const all = union({
  getThingId,
  getThingEdmId,
  getThing,
  getThingSuccess,
  getThingFailure,
  getThingEdm,
  getThingEdmSuccess,
  getThingEdmFailure,
  connectStomp,
  disconnectStomp,
  getStompStatus,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
});

export type ThingActions = typeof all;
