import { createAction, props, union } from '@ngrx/store';

import { IotThing } from '../../reducers/thing/models';

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

export const getStomp = createAction('[Thing] Establish Stomp Connection');

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
  getThing,
  getThingSuccess,
  getThingFailure,
  getStomp,
  getStompStatus,
  subscribeBroadcast,
  subscribeBroadcastSuccess,
});

export type ThingActions = typeof all;
