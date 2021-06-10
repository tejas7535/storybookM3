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
import { ShaftStatus } from '../shaft/models';
import {
  greaseStatusReducer,
  initialState,
  reducer,
} from './grease-status.reducer';

describe('Grease Status Reducer', () => {
  describe('getGreaseStatus', () => {
    it('should set loading', () => {
      const action = getGreaseStatus({ deviceId: 'deviceId' });
      const state = greaseStatusReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getGreaseStatusLatest', () => {
    it('should set latest status loading', () => {
      const action = getGreaseStatusLatest({ deviceId: 'deviceId' });
      const state = greaseStatusReducer(initialState, action);

      expect(state.status.loading).toBeTruthy();
    });
  });

  const mockGcmProcessed = {
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

  const mockShaftStatus: ShaftStatus[] = [
    {
      deviceId: '1',
      rsm01ShaftSpeed: 13,
      rsm01Shaftcountervalue: 3,
      timestamp: '2020-08-02T16:18:59Z',
    },
  ];

  const mockGcmStatus = {
    GcmProcessed: [mockGcmProcessed],
    RsmShafts: mockShaftStatus,
  };
  describe('getGreaseStatusSuccess', () => {
    it('should unset loading and set grease status', () => {
      const action = getGreaseStatusSuccess({ gcmStatus: mockGcmStatus });

      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = greaseStatusReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.result).toEqual(mockGcmStatus);
    });
  });

  describe('getGreaseStatusLatestSuccess', () => {
    it('should unset status loading and set latest grease status', () => {
      const action = getGreaseStatusLatestSuccess({
        greaseStatusLatest: mockGcmProcessed,
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
      expect(state.status.result).toEqual(mockGcmProcessed);
    });
  });

  describe('getGreaseStatusFailure', () => {
    it('should unset loading', () => {
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
    it('should unset latest status loading', () => {
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
    it('should set grease display', () => {
      const mockGreaseDisplay = {
        deterioration_1: false,
        waterContent_1: false,
        temperatureOptics_1: true,
        deterioration_2: false,
        waterContent_2: false,
        temperatureOptics_2: true,
        rsmShaftSpeed: true,
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
    it('should set interval', () => {
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
    it('should return greaseStatusReducer', () => {
      // prepare any action
      const action: Action = getGreaseStatusFailure();
      expect(reducer(initialState, action)).toEqual(
        greaseStatusReducer(initialState, action)
      );
    });
  });
});
