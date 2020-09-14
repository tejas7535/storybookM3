import { createAction, props, union } from '@ngrx/store';

import { Edm, Interval } from '../../reducers/edm-monitor/models';

export const getEdmId = createAction('[EDM Monitor] Load EDM Sensor ID');

export const getEdm = createAction(
  '[EDM Monitor] Load EDM',
  props<{ sensorId: string }>()
);

export const getEdmSuccess = createAction(
  '[EDM Monitor] Load EDM Success',
  props<{ measurements: Edm }>()
);

export const setInterval = createAction(
  '[EDM Monitor] Set Interval',
  props<{ interval: Interval }>()
);

export const getEdmFailure = createAction('[EDM Monitor] Load EDM Failure');

const all = union({
  getEdmId,
  getEdm,
  getEdmSuccess,
  getEdmFailure,
  setInterval,
});

export type EdmMonitorActions = typeof all;
