import { createAction, props, union } from '@ngrx/store';

import { BearingMetadata, ShaftStatus } from '../../reducers/bearing/models';

export const getBearingId = createAction('[Bearing] Load Bearing ID');

export const getBearing = createAction(
  '[Bearing] Load Bearing',
  props<{ bearingId: string }>()
);

export const getBearingSuccess = createAction(
  '[Bearing] Load Bearing Success',
  props<{ bearing: BearingMetadata }>()
);

export const getBearingFailure = createAction('[Bearing] Load Bearing Failure');

export const getShaftId = createAction('[Bearing] Load Shaft ID');

export const getShaft = createAction(
  '[Bearing] Load Shaft',
  props<{ shaftDeviceId: string }>()
);

export const getShaftSuccess = createAction(
  '[Bearing] Load Shaft Success',
  props<{ shaft: ShaftStatus }>()
);

export const getShaftFailure = createAction('[Bearing] Load Shaft Failure');

const all = union({
  getBearingId,
  getBearing,
  getBearingSuccess,
  getBearingFailure,
  getShaftId,
  getShaft,
  getShaftSuccess,
  getShaftFailure,
});

export type BearingActions = typeof all;
