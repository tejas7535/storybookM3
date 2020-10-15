import { Action, createReducer, on } from '@ngrx/store';

import {
  getDevices,
  getDevicesFailure,
  getDevicesSuccess,
} from '../../actions/devices/devices.actions';
import { Device } from './models';

export interface DevicesState {
  loading: boolean;
  result: Device[];
}

export const initialState: DevicesState = {
  loading: false,
  result: undefined,
};

export const devicesReducer = createReducer(
  initialState,
  on(getDevices, (state: DevicesState) => ({
    ...state,
    loading: true,
  })),
  on(getDevicesSuccess, (state: DevicesState, { devices }) => ({
    ...state,
    result: devices,
    loading: false,
  })),
  on(getDevicesFailure, (state: DevicesState) => ({
    ...state,
    loading: false,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: DevicesState, action: Action): DevicesState {
  return devicesReducer(state, action);
}
