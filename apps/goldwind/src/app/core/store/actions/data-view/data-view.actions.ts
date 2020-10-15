import { createAction, props, union } from '@ngrx/store';

import { SensorData } from '../../reducers/data-view/models';
import { Interval } from '../../reducers/shared/models';

export const getDataId = createAction('[Data View] Load Data Device ID');

export const getData = createAction(
  '[Data View] Load Data',
  props<{ deviceId: string }>()
);

export const getDataSuccess = createAction(
  '[Data View] Load Data Success',
  props<{ result: SensorData[] }>()
);

export const setDataInterval = createAction(
  '[Data View] Set Interval',
  props<{ interval: Interval }>()
);

export const setFrequency = createAction(
  '[Data View] Set Frequency',
  props<{ frequency: number }>()
);

export const getDataFailure = createAction('[Data View] Load Data Failure');

const all = union({
  getDataId,
  getData,
  getDataSuccess,
  getDataFailure,
  setDataInterval,
});

export type DataViewActions = typeof all;
