import { Action } from '@ngrx/store';

import {
  getEdm,
  getEdmFailure,
  getEdmSuccess,
  getStompStatus,
  subscribeBroadcastSuccess,
} from '../../actions/condition-monitoring/condition-monitoring.actions';
import {
  conditionMonitoringReducer,
  initialState,
  reducer,
} from './condition-monitoring.reducer';

describe('Condition Monitoring Reducer', () => {
  describe('getEdm', () => {
    test('should set loading', () => {
      const action = getEdm({ sensorId: 'fantasyId' });
      const state = conditionMonitoringReducer(initialState, action);

      expect(state.edm.loading).toBeTruthy();
    });
  });

  describe('getThingEdmSuccess', () => {
    test('should unset loading and set measurements', () => {
      const mockMeasurements = [
        {
          id: 0,
          sensorId: 'fantasyID',
          endDate: '2020-07-30T11:02:35',
          startDate: '2020-07-30T11:02:25',
          sampleRatio: 500,
          edmValue1Counter: 100,
          edmValue2Counter: 200,
        },
      ];
      const action = getEdmSuccess({ measurements: mockMeasurements });

      const fakeState = {
        ...initialState,
        edm: { ...initialState.edm, loading: true },
      };

      const state = conditionMonitoringReducer(fakeState, action);

      expect(state.edm.loading).toBeFalsy();
      expect(state.edm.measurements).toEqual(mockMeasurements);
    });
  });

  describe('getThingEdmFailure', () => {
    test('should unset loading', () => {
      const action = getEdmFailure();
      const fakeState = {
        ...initialState,
        edm: { ...initialState.edm, loading: true },
      };

      const state = conditionMonitoringReducer(fakeState, action);

      expect(state.edm.loading).toBeFalsy();
    });
  });

  describe('getStompStatus', () => {
    test('should set stomp status', () => {
      const testStatus = 1;
      const action = getStompStatus({ status: testStatus });
      const fakeState = {
        ...initialState,
      };

      const state = conditionMonitoringReducer(fakeState, action);

      expect(state.centerLoad.socketStatus).toEqual(testStatus);
    });
  });

  describe('subscribeBroadcastSuccess', () => {
    test('should set message events and bodies', () => {
      const testId = '123456';
      const testBody =
        'this contains a test body, in this case a string, but will get refined over time';
      const action = subscribeBroadcastSuccess({ id: testId, body: testBody });

      const fakeState = {
        ...initialState,
      };

      const mockDate = new Date(1466424490000);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const expectedMessages = {
        events: [{ id: testId, timestamp: +new Date() }],
        contents: { [testId]: testBody },
      };

      const state = conditionMonitoringReducer(fakeState, action);

      expect(state.centerLoad).toEqual(expectedMessages);
    });
  });

  describe('Reducer function', () => {
    test('should return conditionMonitoringReducer', () => {
      // prepare any action
      const action: Action = getEdmFailure();
      expect(reducer(initialState, action)).toEqual(
        conditionMonitoringReducer(initialState, action)
      );
    });
  });
});
