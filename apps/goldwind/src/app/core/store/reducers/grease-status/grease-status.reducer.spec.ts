import { Action } from '@ngrx/store';

import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  getGreaseStatusSuccess,
  setGreaseDisplay,
  setGreaseInterval,
} from '../../actions/grease-status/grease-status.actions';
import {
  greaseStatusReducer,
  initialState,
  reducer,
} from './grease-status.reducer';

describe('Grease Status Reducer', () => {
  describe('getGreaseStatus', () => {
    test('should set loading', () => {
      const action = getGreaseStatus({ greaseStatusId: 'greasyId' });
      const state = greaseStatusReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getGreaseStatusLatest', () => {
    test('should set latest status loading', () => {
      const action = getGreaseStatusLatest({ greaseStatusId: 'greasyId' });
      const state = greaseStatusReducer(initialState, action);

      expect(state.status.loading).toBeTruthy();
    });
  });

  describe('getGreaseStatusSuccess', () => {
    test('should unset loading and set grease status', () => {
      const mockGreaseStatus = [
        {
          deviceId: '1',
          gcm01TemperatureOptics: 99,
          gcm01TemperatureOpticsMax: 102,
          gcm01TemperatureOpticsMin: 5,
          gcm01Deterioration: 19,
          gcm01DeteriorationMin: 22,
          gcm01DeteriorationMax: 33,
          gcm01WaterContent: 0,
          gcm01WaterContentMin: 0,
          gcm01WaterContentMax: 1,
          gcm02TemperatureOptics: 0,
          gcm02TemperatureOpticsMax: 0,
          gcm02TemperatureOpticsMin: 0,
          gcm02Deterioration: 0,
          gcm02DeteriorationMin: 0,
          gcm02DeteriorationMax: 0,
          gcm02WaterContent: 0,
          gcm02WaterContentMin: 0,
          gcm02WaterContentMax: 0,
          timestamp: '2020-08-02T16:18:59Z',
        },
      ];

      const action = getGreaseStatusSuccess({ greaseStatus: mockGreaseStatus });

      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = greaseStatusReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.result).toEqual(mockGreaseStatus);
    });
  });

  describe('getGreaseStatusLatestSuccess', () => {
    test('should unset status loading and set latest grease status', () => {
      const mockGreaseStatus = {
        deviceId: '1',
        gcm01TemperatureOptics: 99,
        gcm01TemperatureOpticsMax: 102,
        gcm01TemperatureOpticsMin: 5,
        gcm01Deterioration: 19,
        gcm01DeteriorationMin: 22,
        gcm01DeteriorationMax: 33,
        gcm01WaterContent: 0,
        gcm01WaterContentMin: 0,
        gcm01WaterContentMax: 1,
        gcm02TemperatureOptics: 0,
        gcm02TemperatureOpticsMax: 0,
        gcm02TemperatureOpticsMin: 0,
        gcm02Deterioration: 0,
        gcm02DeteriorationMin: 0,
        gcm02DeteriorationMax: 0,
        gcm02WaterContent: 0,
        gcm02WaterContentMin: 0,
        gcm02WaterContentMax: 0,
        timestamp: '2020-08-02T16:18:59Z',
      };
      const action = getGreaseStatusLatestSuccess({
        greaseStatusLatest: mockGreaseStatus,
      });

      const fakeState = {
        ...initialState,
        status: {
          ...initialState.status,
          loading: true,
        },
      };

      const state = greaseStatusReducer(fakeState, action);

      expect(state.status.loading).toBeFalsy();
      expect(state.status.result).toEqual(mockGreaseStatus);
    });
  });

  describe('getGreaseStatusFailure', () => {
    test('should unset loading', () => {
      const action = getGreaseStatusFailure();
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = greaseStatusReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('getGreaseStatusLatestFailure', () => {
    test('should unset latest status loading', () => {
      const action = getGreaseStatusLatestFailure();
      const fakeState = {
        ...initialState,
        status: {
          ...initialState.status,
          loading: true,
        },
      };

      const state = greaseStatusReducer(fakeState, action);

      expect(state.status.loading).toBeFalsy();
    });
  });

  describe('setGreaseDisplay', () => {
    test('should set grease display', () => {
      const mockGreaseDisplay = {
        deterioration: false,
        waterContent: false,
        temperatureOptics: true,
        // rotationalSpeed: true,
      };
      const action = setGreaseDisplay({ greaseDisplay: mockGreaseDisplay });
      const fakeState = {
        ...initialState,
      };

      const state = greaseStatusReducer(fakeState, action);

      expect(state.display).toEqual(mockGreaseDisplay);
    });
  });

  describe('setEdmInterval', () => {
    test('should set interval', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };
      const action = setGreaseInterval({ interval: mockInterval });

      const fakeState = {
        ...initialState,
        interval: mockInterval,
      };

      const state = greaseStatusReducer(fakeState, action);

      expect(state.interval).toBe(mockInterval);
    });
  });

  describe('Reducer function', () => {
    test('should return greaseStatusReducer', () => {
      // prepare any action
      const action: Action = getGreaseStatusFailure();
      expect(reducer(initialState, action)).toEqual(
        greaseStatusReducer(initialState, action)
      );
    });
  });
});
