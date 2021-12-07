import { Action } from '@ngrx/store';

import {
  getStaticSafetyId,
  getStaticSafetyLatest,
  getStaticSafetyLatestFailure,
  getStaticSafetyLatestSuccess,
} from '../../actions/static-safety/static-safety.actions';
import { StaticSafetyStatus } from './models/static-safety.model';
import {
  initialState,
  reducer,
  staticSafetyReducer,
} from './static-safety.reducer';

describe('Static Safety Reducer', () => {
  describe('getStaticSafetyLatest', () => {
    it('should change state to passed action prop', () => {
      const action = getStaticSafetyLatest({ deviceId: 'blub' });
      const state = staticSafetyReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getStaticSafetyId', () => {
    it('should change state to passed action prop', () => {
      const action = getStaticSafetyId({ source: 'Hello' });
      const state = staticSafetyReducer(initialState, action);

      // id will be read from url so no request needed and no loading indicatior as well
      expect(state.loading).toBe(false);
    });
  });

  describe('getStaticSafetyLatestSuccess', () => {
    it('should change state to passed action prop', () => {
      const result = {
        deviceId: 'blub',
        property: 'blob',
        timestamp: new Date(),
        value: 21,
      } as StaticSafetyStatus;
      const action = getStaticSafetyLatestSuccess({
        result,
      });
      const state = staticSafetyReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.status.result).toBe(result);
    });
  });
  describe('getStaticSafetyLatestFailure', () => {
    it('should change state to passed action prop', () => {
      const action = getStaticSafetyLatestFailure();
      const state = staticSafetyReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.status.result).toBe(undefined);
    });
  });

  describe('Reducer function', () => {
    it('should return a Reducer', () => {
      // prepare any action
      const action: Action = getStaticSafetyLatestFailure();
      expect(reducer(initialState, action)).toEqual(
        staticSafetyReducer(initialState, action)
      );
    });
  });
});
