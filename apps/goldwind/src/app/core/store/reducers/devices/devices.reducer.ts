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
  on(
    getDevices,
    (state: DevicesState): DevicesState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    getDevicesSuccess,
    (state: DevicesState, { devices }): DevicesState => ({
      ...state,
      result: devices,
      loading: false,
    })
  ),
  on(
    getDevicesFailure,
    (state: DevicesState): DevicesState => ({
      ...state,
      loading: false,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: DevicesState, action: Action): DevicesState {
  return devicesReducer(state, action);
}
