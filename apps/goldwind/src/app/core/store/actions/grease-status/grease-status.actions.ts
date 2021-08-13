import { createAction, props, union } from '@ngrx/store';

import { GcmStatus } from '../../reducers/grease-status/models';

const TYPE = 'GreaseStatus';

export const getGreaseStatusId = createAction(
  `[${TYPE}] Load Grease Sensor ID`,
  props<{ source: string }>()
);

export const getGreaseStatus = createAction(
  `[${TYPE}] Load ${TYPE}`,
  props<{ deviceId: string }>()
);

export const getGreaseStatusSuccess = createAction(
  `[${TYPE}] Load ${TYPE} Success`,
  props<{ gcmStatus: GcmStatus[] }>()
);

export const getGreaseStatusFailure = createAction(
  `[${TYPE}] Load ${TYPE} Failure`
);

export const getGreaseStatusLatest = createAction(
  `[${TYPE}] Load Latest ${TYPE}`,
  props<{ deviceId: string }>()
);

export const stopGetGreaseStatusLatest = createAction(
  `[${TYPE}] Stop Load Latest ${TYPE}`
);

export const getGreaseStatusLatestSuccess = createAction(
  `[${TYPE}] Load Latest ${TYPE} Success`,
  props<{ greaseStatusLatest: GcmStatus }>()
);

export const getGreaseStatusLatestFailure = createAction(
  `[${TYPE}] Load Latest ${TYPE} Failure`
);

const all = union({
  getGreaseStatusId,
  getGreaseStatus,
  getGreaseStatusSuccess,
  getGreaseStatusFailure,
  stopGetGreaseStatusLatest,
});

export type GreaseStatusActions = typeof all;
