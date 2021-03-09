import { createAction, props, union } from '@ngrx/store';

import { LoadSense } from '../../reducers/load-sense/models';

export const getLoadId = createAction('[Load Sense] Load Load Id');

export const getBearingLoadLatest = createAction(
  '[Load Sense] Get Load',
  props<{ deviceId: string }>()
);

export const stopGetLoad = createAction('[Load Sense] Stop Load');

export const getBearingLoadSuccess = createAction(
  '[Load Sense] Get Load Success',
  props<{ bearingLoadLatest: LoadSense }>()
);

export const getBearingLoadFailure = createAction(
  '[Load Sense] Get Load Failure'
);

const all = union({
  getLoadId,
  getBearingLoadLatest,
  stopGetLoad,
  getBearingLoadFailure,
  getBearingLoadSuccess,
});

export type LoadSenseActions = typeof all;
