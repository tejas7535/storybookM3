import { Action } from '@ngrx/store';

import { BEARING_MOCK } from '../../../../../testing/mocks';
import {
  getBearing,
  getBearingFailure,
  getBearingSuccess,
  getShaft,
  getShaftFailure,
  getShaftSuccess,
} from '../../actions/bearing/bearing.actions';
import { bearingReducer, initialState, reducer } from './bearing.reducer';

describe('Bearing Reducer', () => {
  describe('getBearing', () => {
    test('should set loading', () => {
      const action = getBearing({ bearingId: '123' });
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getBearingSuccess', () => {
    test('should unset loading and set bearing', () => {
      const action = getBearingSuccess({ bearing: BEARING_MOCK });

      const fakeState = {
        ...initialState,
        result: { ...initialState.result, loading: true },
      };

      const state = bearingReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.result).toEqual(BEARING_MOCK);
    });
  });

  describe('getBearingFailure', () => {
    test('should unset loading', () => {
      const action = getBearingFailure();
      const fakeState = {
        ...initialState,
        result: { ...initialState.result, loading: true },
      };

      const state = bearingReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('getShaft', () => {
    test('should set shaft loading', () => {
      const action = getShaft({ shaftDeviceId: '123' });
      const state = bearingReducer(initialState, action);

      expect(state.shaft.loading).toBeTruthy();
    });
  });

  describe('getShaftSuccess', () => {
    test('should unset shaft loading and set shaft result', () => {
      const SHAFT_MOCK = {
        id: 'fakeid',
        deviceId: 'fakedeviceid',
        timeStamp: '2020-11-12T18:31:56.954003Z',
        rsm01Shaftcountervalue: 666,
      };
      const action = getShaftSuccess({ shaft: SHAFT_MOCK });

      const fakeState = {
        ...initialState,
        shaft: { ...initialState.shaft, loading: true },
      };

      const state = bearingReducer(fakeState, action);

      expect(state.shaft.loading).toBeFalsy();
      expect(state.shaft.result).toEqual(SHAFT_MOCK);
    });
  });

  describe('getShaftFailure', () => {
    test('should unset shaft loading', () => {
      const action = getShaftFailure();
      const fakeState = {
        ...initialState,
        shaft: { ...initialState.shaft, loading: true },
      };

      const state = bearingReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('Reducer function', () => {
    test('should return bearingReducer', () => {
      // prepare any action
      const action: Action = getBearingFailure();
      expect(reducer(initialState, action)).toEqual(
        bearingReducer(initialState, action)
      );
    });
  });
});
