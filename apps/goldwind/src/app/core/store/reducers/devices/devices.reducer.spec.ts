import { Action } from '@ngrx/store';

import { DEVICES_MOCK } from '../../../../../testing/mocks';
import {
  getDevices,
  getDevicesFailure,
  getDevicesSuccess,
} from '../../actions/devices/devices.actions';
import { devicesReducer, initialState, reducer } from './devices.reducer';

describe('Devices Reducer', () => {
  describe('getDevices', () => {
    it('should set loading', () => {
      const action = getDevices();
      const state = devicesReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getDevicesSuccess', () => {
    it('should unset loading and set devices', () => {
      const action = getDevicesSuccess({ devices: DEVICES_MOCK });

      const fakeState = {
        ...initialState,
        result: { ...initialState.result, loading: true },
      };

      const state = devicesReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.result).toEqual(DEVICES_MOCK);
    });
  });

  describe('getDevicesFailure', () => {
    it('should unset loading', () => {
      const action = getDevicesFailure();
      const fakeState = {
        ...initialState,
        result: { ...initialState.result, loading: true },
      };

      const state = devicesReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('Reducer function', () => {
    it('should return devicesReducer', () => {
      // prepare any action
      const action: Action = getDevicesFailure();
      expect(reducer(initialState, action)).toEqual(
        devicesReducer(initialState, action)
      );
    });
  });
});
