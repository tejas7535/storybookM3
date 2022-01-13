import { Action } from '@ngrx/store';
import { RSMShaftEntity } from '../../../http/types';

import {
  getShaft,
  getShaftFailure,
  getShaftLatest,
  getShaftLatestFailure,
  getShaftLatestSuccess,
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
    it('should set shaft loading', () => {
      const action = getShaft({ deviceId: '123' });
      const state = shaftReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getShaftSuccess', () => {
    it('should unset shaft loading and set shaft result', () => {
      const SHAFT_MOCK: ShaftStatus[] = [
        {
          deviceId: 'fakedeviceid',
          timestamp: '2020-11-12T18:31:56.954003Z',
          rsm01ShaftSpeed: 3,
          rsm01ShaftCounterValue: 666,
        },
      ];
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
    it('should unset shaft loading', () => {
      const action = getShaftFailure();
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = shaftReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('getShaftLatest', () => {
    it('should set shaft latest loading', () => {
      const action = getShaftLatest({ deviceId: '123' });
      const state = shaftReducer(initialState, action);

      expect(state.status.loading).toBeTruthy();
    });
  });

  describe('getShaftLatestSuccess', () => {
    it('should unset shaft latest loading and set shaft latest result', () => {
      const SHAFT_MOCK: RSMShaftEntity = {
        deviceId: 'fakedeviceid',
        timestamp: '2020-11-12T18:31:56.954003Z',
        rsm01ShaftSpeed: 3,
        rsm01Shaftcountervalue: 666,
      };
      const action = getShaftLatestSuccess({ shaft: SHAFT_MOCK });

      const fakeState: ShaftState = {
        ...initialState,
        status: {
          ...initialState.status,
          loading: true,
        },
      };

      const state = shaftReducer(fakeState, action);

      expect(state.status.loading).toBeFalsy();
      expect(state.status.result).toEqual(SHAFT_MOCK);
    });
  });

  describe('getShaftLatestFailure', () => {
    it('should unset shaft latest loading', () => {
      const action = getShaftLatestFailure();
      const fakeState = {
        ...initialState,
        status: {
          ...initialState.status,
          loading: true,
        },
      };

      const state = shaftReducer(fakeState, action);

      expect(state.status.loading).toBeFalsy();
    });
  });

  describe('Reducer function', () => {
    it('should return shaftReducer', () => {
      // prepare any action
      const action: Action = getShaftFailure();
      expect(reducer(initialState, action)).toEqual(
        shaftReducer(initialState, action)
      );
    });
  });
});
