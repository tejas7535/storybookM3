import { Action } from '@ngrx/store';

import {
  getLoad,
  getLoadFailure,
  getLoadSuccess,
} from '../../actions/load-sense/load-sense.actions';
import { initialState, loadSenseReducer, reducer } from './load-sense.reducer';

describe('Load Sense Reducer', () => {
  describe('getLoad', () => {
    test('should set loading', () => {
      const action = getLoad({ bearingId: '123' });
      const state = loadSenseReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getLoadSuccess', () => {
    test('should unset loading and set bearing', () => {
      const mockResult = [
        {
          deviceId: 'string',
          id: 'string',
          lsp01Strain: 0,
          lsp02Strain: 0,
          lsp03Strain: 0,
          lsp04Strain: 0,
          lsp05Strain: 0,
          lsp06Strain: 0,
          lsp07Strain: 0,
          lsp08Strain: 0,
          lsp09Strain: 0,
          lsp10Strain: 0,
          lsp11Strain: 0,
          lsp12Strain: 0,
          lsp13Strain: 0,
          lsp14Strain: 0,
          lsp15Strain: 0,
          lsp16Strain: 0,
          timestamp: '2020-11-04T09:39:19.499Z',
        },
      ];
      const action = getLoadSuccess({ loadSense: mockResult });

      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = loadSenseReducer(fakeState, action);

      expect(state.loading).toBeFalsy();

      expect(state.result).toEqual(mockResult);
    });
  });

  describe('getLoadFailure', () => {
    test('should unset loading', () => {
      const action = getLoadFailure();
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = loadSenseReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });
  describe('Reducer function', () => {
    test('should return loadSenseReducer', () => {
      // prepare any action
      const action: Action = getLoadFailure();
      expect(reducer(initialState, action)).toEqual(
        loadSenseReducer(initialState, action)
      );
    });
  });
});
