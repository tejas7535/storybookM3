import { createAction, props, union } from '@ngrx/store';

export const getThing = createAction(
  '[Thing] Load Thing',
  props<{ thingId: number }>()
);

export const getThingSuccess = createAction(
  '[Thing] Load Thing Success',
  props<{ thing: any }>()
);

export const getThingFailure = createAction('[Thing] Load Thing Failure');

const all = union({
  getThing,
  getThingSuccess,
  getThingFailure,
});

export type ThingActions = typeof all;
