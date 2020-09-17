import { Action } from '@ngrx/store';

import {
  getGreaseStatus,
  getGreaseStatusFailure,
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

  describe('getGreaseStatusSuccess', () => {
    test('should unset loading and set grease status', () => {
      const mockGreaseStatus = [
        {
          id: 1,
          sensorId: '123-abc-456',
          endDate: '2020-08-12T18:09:25',
          startDate: '2020-08-12T18:09:19',
          sampleRatio: 9999,
          waterContentPercent: 69,
          deteriorationPercent: 96,
          temperatureCelsius: 9000,
          isAlarm: true,
        },
      ];

      const action = getGreaseStatusSuccess({ greaseStatus: mockGreaseStatus });

      const fakeState = {
        ...initialState,
        result: { ...initialState.result, loading: true },
      };

      const state = greaseStatusReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.result).toEqual(mockGreaseStatus);
    });
  });

  describe('getGreaseStatusFailure', () => {
    test('should unset loading', () => {
      const action = getGreaseStatusFailure();
      const fakeState = {
        ...initialState,
        result: { ...initialState, loading: true },
      };

      const state = greaseStatusReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('setGreaseDisplay', () => {
    test('should set grease display', () => {
      const mockGreaseDisplay = {
        deteriorationPercent: false,
        temperatureCelsius: true,
        waterContentPercent: false,
        rotationalSpeed: true,
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

      expect(state.loading).toBeFalsy();
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
