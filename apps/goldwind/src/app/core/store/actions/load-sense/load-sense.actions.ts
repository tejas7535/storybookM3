import { createAction, props, union } from '@ngrx/store';

import { LoadSense } from '../../reducers/load-sense/models';

export const getLoadId = createAction('[Load Sense] Load Load Id');

export const getLoad = createAction(
  '[Load Sense] Get Load',
  props<{ bearingId: string }>()
);

export const getLoadSuccess = createAction(
  '[Load Sense] Get Load Success',
  props<{ loadSense: LoadSense[] }>()
);

export const getLoadFailure = createAction('[Load Sense] Get Load Failure');

const all = union({
  getLoadId,
  getLoad,
  getLoadFailure,
  getLoadSuccess,
});

export type LoadSenseActions = typeof all;
