import { createAction, props, union } from '@ngrx/store';

import { IotThing } from '../../reducers/bearing/models';

export const getBearingId = createAction('[Bearing] Load Bearing ID');

export const getBearing = createAction(
  '[Bearing] Load Bearing',
  props<{ bearingId: number }>()
);

export const getBearingSuccess = createAction(
  '[Bearing] Load Bearing Success',
  props<{ bearing: IotThing }>()
);

export const getBearingFailure = createAction('[Bearing] Load Bearing Failure');

const all = union({
  getBearingId,
  getBearing,
  getBearingSuccess,
  getBearingFailure,
});

export type BearingActions = typeof all;
