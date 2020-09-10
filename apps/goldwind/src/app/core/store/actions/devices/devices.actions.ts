import { createAction, props, union } from '@ngrx/store';

import { Devices } from '../../reducers/devices/models/devices.model';

export const getDevices = createAction('[Devices] Load Devices');

export const getDevicesSuccess = createAction(
  '[Devices] Load Devices Success',
  props<{ devices: Devices }>()
);

export const getDevicesFailure = createAction('[Devices] Load Devices Failure');

const all = union({
  getDevices,
  getDevicesSuccess,
  getDevicesFailure,
});

export type DevicesActions = typeof all;
