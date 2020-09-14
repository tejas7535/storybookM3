import { Action } from '@ngrx/store';

import {
  getStompStatus,
  subscribeBroadcastSuccess,
} from '../../actions/condition-monitoring/condition-monitoring.actions';
import {
  conditionMonitoringReducer,
  initialState,
  reducer,
} from './condition-monitoring.reducer';

describe('Condition Monitoring Reducer', () => {
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
      const action: Action = getStompStatus({ status: 1 });
      expect(reducer(initialState, action)).toEqual(
        conditionMonitoringReducer(initialState, action)
      );
    });
  });
});
