import { Action } from '@ngrx/store';

import {
  getEdm,
  getEdmFailure,
  getEdmSuccess,
  setEdmInterval,
} from '../../actions/edm-monitor/edm-monitor.actions';
import {
  edmMonitorReducer,
  initialState,
  reducer,
} from './edm-monitor.reducer';
import { Edm } from './models';

describe('Condition Monitoring Reducer', () => {
  describe('getEdm', () => {
    test('should set loading', () => {
      const action = getEdm({ deviceId: 'fantasyId' });
      const state = edmMonitorReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getEdmSuccess', () => {
    test('should unset loading and set measurements', () => {
      const mockMeasurements: Edm[] = [
        {
          startDate: '2020-07-30T11:02:25',
          edmValue1Counter: 100,
          edmValue2Counter: 200,
          edmValue1CounterMax: 300,
          edmValue2CounterMax: 400,
        },
      ];
      const action = getEdmSuccess({ measurements: mockMeasurements });

      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = edmMonitorReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
      expect(state.measurements).toEqual(mockMeasurements);
    });
  });

  describe('getEdmFailure', () => {
    test('should unset loading', () => {
      const action = getEdmFailure();
      const fakeState = {
        ...initialState,
        loading: true,
      };

      const state = edmMonitorReducer(fakeState, action);

      expect(state.loading).toBeFalsy();
    });
  });

  describe('setEdmInterval', () => {
    test('should set interval', () => {
      const mockInterval = {
        startDate: 1599651508,
        endDate: 1599651509,
      };
      const action = setEdmInterval({ interval: mockInterval });

      const fakeState = {
        ...initialState,
        interval: mockInterval,
      };

      const state = edmMonitorReducer(fakeState, action);

      expect(state.interval).toBe(mockInterval);
    });
  });

  describe('Reducer function', () => {
    test('should return edmMonitorReducer', () => {
      // prepare any action
      const action: Action = getEdmFailure();
      expect(reducer(initialState, action)).toEqual(
        edmMonitorReducer(initialState, action)
      );
    });
  });
});
