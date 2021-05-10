import { createAction, props, union } from '@ngrx/store';

import { LoadSense } from '../../reducers/load-sense/models';

export const getLoadId = createAction('[Load Sense] Load Load Id');

export const getBearingLoadLatest = createAction(
  '[Load Sense] Get Load',
  props<{ deviceId: string }>()
);

export const getLoadAverage = createAction(
  '[Load Sense] Get Load Average',
  props<{ deviceId: string }>()
);

export const getLoadAverageSuccess = createAction(
  '[Load Sense] Get Load Average Success',
  props<{ loadAverage: LoadSense }>()
);

export const getLoadAverageFailure = createAction(
  '[Load Sense] Get Load Average Failure'
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
  getLoadAverage,
  getLoadAverageSuccess,
  getLoadAverageFailure,
});

export type LoadSenseActions = typeof all;
