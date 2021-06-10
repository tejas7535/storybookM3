import { Action } from '@ngrx/store';

import { BEARING_MOCK } from '../../../../../testing/mocks';
import {
  getBearing,
  getBearingFailure,
  getBearingSuccess,
} from '../../actions/bearing/bearing.actions';
import { bearingReducer, initialState, reducer } from './bearing.reducer';

describe('Bearing Reducer', () => {
  describe('getBearing', () => {
    it('should set loading', () => {
      const action = getBearing({ bearingId: '123' });
      const state = bearingReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getBearingSuccess', () => {
    it('should unset loading and set bearing', () => {
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
    it('should unset loading', () => {
      const action = getBearingFailure();
      const fakeState = {
        ...initialState,
        result: { ...initialState.result, loading: true },
      };

      const state = bearingReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('Reducer function', () => {
    it('should return bearingReducer', () => {
      // prepare any action
      const action: Action = getBearingFailure();
      expect(reducer(initialState, action)).toEqual(
        bearingReducer(initialState, action)
      );
    });
  });
});
