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
import { EdmStatus } from './models';

describe('Condition Monitoring Reducer', () => {
  describe('getEdm', () => {
    it('should set loading', () => {
      const action = getEdm({ deviceId: 'fantasyId' });
      const state = edmMonitorReducer(initialState, action);

      expect(state.loading).toBeTruthy();
    });
  });

  describe('getEdmSuccess', () => {
    it('should unset loading and set measurements', () => {
      const mockMeasurements: EdmStatus[] = [
        {
          deviceId: 'A-Wing',
          timestamp: '2020-07-30T11:02:25',
          startTimestamp: '2020-07-30T11:02:25',
          endTimestamp: '2020-07-30T11:02:25',
          edm01Ai01Counter: 100,
          edm01Ai02Counter: 100,
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
    it('should unset loading', () => {
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
    it('should set interval', () => {
      const mockInterval = {
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
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
    it('should return edmMonitorReducer', () => {
      // prepare any action
      const action: Action = getEdmFailure();
      expect(reducer(initialState, action)).toEqual(
        edmMonitorReducer(initialState, action)
      );
    });
  });
});
