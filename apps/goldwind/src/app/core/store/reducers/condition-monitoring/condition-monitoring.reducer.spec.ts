import { Action } from '@ngrx/store';

import {
  getLoad,
  getLoadFailure,
  getLoadSuccess,
} from '../../actions/condition-monitoring/condition-monitoring.actions';
import {
  conditionMonitoringReducer,
  initialState,
  reducer,
} from './condition-monitoring.reducer';

describe('Condition Monitoring Reducer', () => {
  describe('getBearing', () => {
    test('should set loading', () => {
      const action = getLoad({ bearingId: '123' });
      const state = conditionMonitoringReducer(initialState, action);

      expect(state.centerLoad.loading).toBeTruthy();
    });
  });

  describe('getBearingSuccess', () => {
    test('should unset loading and set bearing', () => {
      const testId = '123456';
      const testBody =
        'this contains a test body, in this case a string, but will get refined over time';
      const action = getLoadSuccess({ id: testId, body: testBody });

      const fakeState = {
        ...initialState,
      };

      const mockDate = new Date(1466424490000);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const expectedMessages = {
        loading: false,
        events: [{ id: testId, timestamp: +new Date() }],
        contents: { [testId]: testBody },
      };

      const state = conditionMonitoringReducer(fakeState, action);

      expect(state.centerLoad).toEqual(expectedMessages);
    });
  });

  describe('getBearingFailure', () => {
    test('should unset loading', () => {
      const action = getLoadFailure();
      const fakeState = {
        ...initialState,
        centerLoad: { ...initialState.centerLoad, loading: true },
      };

      const state = conditionMonitoringReducer(fakeState, action);

      expect(state.centerLoad.loading).toBeFalsy();
    });
  });
  describe('Reducer function', () => {
    test('should return conditionMonitoringReducer', () => {
      // prepare any action
      const action: Action = getLoadFailure();
      expect(reducer(initialState, action)).toEqual(
        conditionMonitoringReducer(initialState, action)
      );
    });
  });
});
