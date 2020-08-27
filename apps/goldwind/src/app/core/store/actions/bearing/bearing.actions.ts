import { createAction, props, union } from '@ngrx/store';

import { BearingMetadata } from '../../reducers/bearing/models';

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

const all = union({
  getBearingId,
  getBearing,
  getBearingSuccess,
  getBearingFailure,
});

export type BearingActions = typeof all;
