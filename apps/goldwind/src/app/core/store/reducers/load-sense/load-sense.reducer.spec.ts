import { Action } from '@ngrx/store';

import { getBearingLoadLatest } from '../..';
import {
  getBearingLoad,
  getBearingLoadFailure,
  getBearingLoadLatestFailure,
  getBearingLoadLatestSuccess,
  getBearingLoadSuccess,
  getLoadAverage,
  getLoadAverageFailure,
  getLoadAverageSuccess,
} from '../../actions';
import { initialState, loadSenseReducer, reducer } from './load-sense.reducer';
import { LoadSense } from './models';

describe('Load Sense Reducer', () => {
  describe('getLoad', () => {
    it('should set loading', () => {
      const action = getBearingLoad({ deviceId: '123' });
      const state = loadSenseReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getLoadLatest', () => {
    it('should set loading', () => {
      const action = getBearingLoadLatest({ deviceId: '123' });
      const state = loadSenseReducer(initialState, action);

      expect(state.status.loading).toBeTruthy();
    });
  });

  describe('getLoadAverage', () => {
    it('should set loading', () => {
      const action = getLoadAverage({ deviceId: '123' });
      const state = loadSenseReducer(initialState, action);

      expect(state.averageResult.loading).toBeTruthy();
    });
  });

  describe('getLoadAverageSuccess', () => {
    it('should unset loading and set state', () => {
      const mockResult: LoadSense = {
        deviceId: 'string',
        lsp02Strain: 0,
        lsp01Strain: 0,
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
      } as LoadSense;
      const action = getLoadAverageSuccess({ loadAverage: mockResult });

      const fakeState = {
        ...initialState,
        averageResult: {
          loading: true,
        },
      };

      const state = loadSenseReducer(fakeState, action);

      expect(state.averageResult.loading).toBeFalsy();

      expect(state.averageResult.result).toEqual(mockResult);
    });
  });

  describe('getLoadSuccess', () => {
    it('should unset loading and set bearing', () => {
      const mockResult: LoadSense[] = [
        {
          deviceId: 'string',
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
        } as LoadSense,
      ];
      const action = getBearingLoadSuccess({
        bearingLoad: mockResult,
      });

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
    it('should unset loading', () => {
      const action = getBearingLoadFailure();
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = loadSenseReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('getLoadLatestSuccess', () => {
    it('should unset loading and set bearing', () => {
      const mockResult: LoadSense = {
        deviceId: 'string',
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
      } as LoadSense;
      const action = getBearingLoadLatestSuccess({
        bearingLoadLatest: mockResult,
      });

      const fakeState = {
        ...initialState,
        status: {
          ...initialState.status,
          loading: true,
        },
      };

      const state = loadSenseReducer(fakeState, action);

      expect(state.status.loading).toBeFalsy();

      expect(state.status.result).toEqual(mockResult);
    });
  });

  describe('getLoadLatestFailure', () => {
    it('should unset loading', () => {
      const action = getBearingLoadLatestFailure();
      const fakeState = {
        ...initialState,
        status: {
          ...initialState.status,
          loading: true,
        },
      };

      const state = loadSenseReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('getLoadAverageFailure', () => {
    it('should unset loading', () => {
      const action = getLoadAverageFailure();
      const fakeState = {
        ...initialState,
        averageResult: {
          loading: true,
        },
      };

      const state = loadSenseReducer(fakeState, action);

      expect(state.averageResult.loading).toBeFalsy();
    });
  });

  describe('Reducer function', () => {
    it('should return loadSenseReducer', () => {
      // prepare any action
      const action: Action = getBearingLoadLatestFailure();
      expect(reducer(initialState, action)).toEqual(
        loadSenseReducer(initialState, action)
      );
    });
  });
});
