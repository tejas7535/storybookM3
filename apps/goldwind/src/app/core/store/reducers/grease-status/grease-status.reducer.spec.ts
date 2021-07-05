import { Action } from '@ngrx/store';

import {
  getGreaseStatus,
  getGreaseStatusFailure,
  getGreaseStatusLatest,
  getGreaseStatusLatestFailure,
  getGreaseStatusLatestSuccess,
  getGreaseStatusSuccess,
} from '../../actions/grease-status/grease-status.actions';
import {
  greaseStatusReducer,
  initialState,
  reducer,
} from './grease-status.reducer';
import { GcmStatus } from './models';

const mockGcmStatus: GcmStatus[] = [
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
        greaseStatusLatest: mockGcmStatus[0],
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
      expect(state.status.result).toEqual(mockGcmStatus[0]);
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
