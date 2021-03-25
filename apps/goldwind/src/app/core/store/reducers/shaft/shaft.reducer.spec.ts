import { Action } from '@ngrx/store';

import {
  getShaft,
  getShaftFailure,
  getShaftSuccess,
} from '../../actions/shaft/shaft.actions';
import { ShaftStatus } from './models';
import {
  initialState,
  reducer,
  shaftReducer,
  ShaftState,
} from './shaft.reducer';

describe('Shaft Reducer', () => {
  describe('getShaft', () => {
    test('should set shaft loading', () => {
      const action = getShaft({ deviceId: '123' });
      const state = shaftReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getShaftSuccess', () => {
    test('should unset shaft loading and set shaft result', () => {
      const SHAFT_MOCK: ShaftStatus = {
        deviceId: 'fakedeviceid',
        timestamp: '2020-11-12T18:31:56.954003Z',
        rsm01ShaftSpeed: 3,
        rsm01Shaftcountervalue: 666,
      };
      const action = getShaftSuccess({ shaft: SHAFT_MOCK });

      const fakeState: ShaftState = {
        ...initialState,
        loading: true,
      };

      const state = shaftReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.result).toEqual(SHAFT_MOCK);
    });
  });

  describe('getShaftFailure', () => {
    test('should unset shaft loading', () => {
      const action = getShaftFailure();
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = shaftReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('Reducer function', () => {
    test('should return shaftReducer', () => {
      // prepare any action
      const action: Action = getShaftFailure();
      expect(reducer(initialState, action)).toEqual(
        shaftReducer(initialState, action)
      );
    });
  });
});
