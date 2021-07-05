import { createAction, props, union } from '@ngrx/store';

import { GcmStatus } from '../../reducers/grease-status/models';

export const getGreaseStatusId = createAction(
  '[Grease Status] Load Grease Sensor ID',
  props<{ source: string }>()
);

export const getGreaseStatus = createAction(
  '[Grease Status] Load Grease Status',
  props<{ deviceId: string }>()
);

export const getGreaseStatusSuccess = createAction(
  '[Grease Status] Load Grease Status Success',
  props<{ gcmStatus: GcmStatus[] }>()
);

export const getGreaseStatusFailure = createAction(
  '[Grease Status] Load Grease Status Failure'
);

export const getGreaseStatusLatest = createAction(
  '[Grease Status] Load Latest Grease Status',
  props<{ deviceId: string }>()
);

export const stopGetGreaseStatusLatest = createAction(
  '[Grease Status] Stop Load Latest Grease Status'
);

export const getGreaseStatusLatestSuccess = createAction(
  '[Grease Status] Load Latest Grease Status Success',
  props<{ greaseStatusLatest: GcmStatus }>()
);

export const getGreaseStatusLatestFailure = createAction(
  '[Grease Status] Load Latest Grease Status Failure'
);

const all = union({
  getGreaseStatusId,
  getGreaseStatus,
  getGreaseStatusSuccess,
  getGreaseStatusFailure,
  stopGetGreaseStatusLatest,
});

export type GreaseStatusActions = typeof all;
