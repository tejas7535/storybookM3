import { createAction, props, union } from '@ngrx/store';

import { ShaftStatus } from '../../reducers/shaft/models';

export const getShaftId = createAction('[Shaft] Load Shaft ID');

export const getShaft = createAction(
  '[Shaft] Load Shaft',
  props<{ deviceId: string }>()
);

export const stopGetShaft = createAction('[Shaft] Stop Load Shaft');

export const getShaftSuccess = createAction(
  '[Shaft] Load Shaft Success',
  props<{ shaft: ShaftStatus }>()
);

export const getShaftFailure = createAction('[Shaft] Load Shaft Failure');

const all = union({
  getShaftId,
  getShaft,
  stopGetShaft,
  getShaftSuccess,
  getShaftFailure,
});

export type ShaftActions = typeof all;
