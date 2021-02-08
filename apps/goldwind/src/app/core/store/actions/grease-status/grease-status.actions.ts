import { createAction, props, union } from '@ngrx/store';

import {
  GreaseDisplay,
  GreaseStatus,
} from '../../reducers/grease-status/models';
import { Interval } from '../../reducers/shared/models';

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
  props<{ greaseStatus: GreaseStatus[] }>()
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
  props<{ greaseStatusLatest: GreaseStatus }>()
);

export const getGreaseStatusLatestFailure = createAction(
  '[Grease Status] Load Latest Grease Status Failure'
);

export const setGreaseDisplay = createAction(
  '[Grease Status] Set Grease Display',
  props<{ greaseDisplay: GreaseDisplay }>()
);

export const setGreaseInterval = createAction(
  '[Grease Status] Set Interval',
  props<{ interval: Interval }>()
);

const all = union({
  getGreaseStatusId,
  getGreaseStatus,
  getGreaseStatusSuccess,
  getGreaseStatusFailure,
  setGreaseDisplay,
  setGreaseInterval,
  stopGetGreaseStatusLatest,
});

export type GreaseStatusActions = typeof all;
