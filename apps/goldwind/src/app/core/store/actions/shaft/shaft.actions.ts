import { createAction, props, union } from '@ngrx/store';
import { RSMShaftEntity } from '../../../http/types/rsm.entity';

import { ShaftStatus } from '../../reducers/shaft/models';

export const getShaftId = createAction(
  '[Shaft] Load Shaft ID',
  props<{ source: string }>()
);

export const getShaftLatest = createAction(
  '[Shaft] Load Shaft Latest',
  props<{ deviceId: string }>()
);

export const stopGetShaftLatest = createAction(
  '[Shaft] Stop Load Shaft Latest'
);

export const getShaftLatestSuccess = createAction(
  '[Shaft] Load Shaft Latest Success',
  props<{ shaft: RSMShaftEntity }>()
);

export const getShaftLatestFailure = createAction(
  '[Shaft] Load Shaft Latest Failure'
);

export const getShaft = createAction(
  '[Shaft] Load Shaft',
  props<{ deviceId: string }>()
);

export const getShaftSuccess = createAction(
  '[Shaft] Load Shaft Success',
  props<{ shaft: ShaftStatus[] }>()
);

export const getShaftFailure = createAction('[Shaft] Load Shaft Failure');

const all = union({
  getShaftId,
  getShaftLatest,
  getShaftLatestSuccess,
  getShaftLatestFailure,
  stopGetShaftLatest,
  getShaft,
  getShaftSuccess,
  getShaftFailure,
});

export type ShaftActions = typeof all;
