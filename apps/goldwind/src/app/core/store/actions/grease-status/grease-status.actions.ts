import { createAction, props, union } from '@ngrx/store';

import {
  GreaseDisplay,
  GreaseStatus,
} from '../../reducers/grease-status/models';

export const getGreaseStatusId = createAction(
  '[Grease Status] Load Grease Sensor ID'
);

export const getGreaseStatus = createAction(
  '[Grease Status] Load Grease Status',
  props<{ greaseStatusId: string }>()
);

export const getGreaseStatusSuccess = createAction(
  '[Grease Status] Load Grease Status Success',
  props<{ greaseStatus: GreaseStatus }>()
);

export const getGreaseStatusFailure = createAction(
  '[Grease Status] Load Grease Status Failure'
);

export const setGreaseDisplay = createAction(
  '[Grease Status] Set Grease Display',
  props<{ greaseDisplay: GreaseDisplay }>()
);

const all = union({
  getGreaseStatusId,
  getGreaseStatus,
  getGreaseStatusSuccess,
  getGreaseStatusFailure,
  setGreaseDisplay,
});

export type GreaseStatusActions = typeof all;
