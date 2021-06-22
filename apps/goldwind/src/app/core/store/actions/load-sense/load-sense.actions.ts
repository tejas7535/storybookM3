import { createAction, props, union } from '@ngrx/store';

import { LoadSense } from '../../reducers/load-sense/models';

export const getLoadId = createAction('[Load Sense] Load Load Id');

export const getBearingLoadLatest = createAction(
  '[Load Sense] Get Load Latest',
  props<{ deviceId: string }>()
);

export const getBearingLoad = createAction(
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

export const getBearingLoadLatestSuccess = createAction(
  '[Load Sense] Get Load Latest Success',
  props<{ bearingLoadLatest: LoadSense }>()
);

export const getBearingLoadLatestFailure = createAction(
  '[Load Sense] Get Load Latest Failure'
);

export const getBearingLoadSuccess = createAction(
  '[Load Sense] Get Load Success',
  props<{ bearingLoad: LoadSense[] }>()
);

export const getBearingLoadFailure = createAction(
  '[Load Sense] Get Load Failure'
);

const all = union({
  getLoadId,
  getBearingLoadLatest,
  stopGetLoad,
  getBearingLoadLatestFailure,
  getBearingLoadLatestSuccess,
  getBearingLoadFailure,
  getBearingLoadSuccess,
  getLoadAverage,
  getLoadAverageSuccess,
  getLoadAverageFailure,
  getBearingLoad,
});

export type LoadSenseActions = typeof all;
