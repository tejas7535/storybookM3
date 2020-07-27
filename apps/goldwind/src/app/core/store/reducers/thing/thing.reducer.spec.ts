import { Action } from '@ngrx/store';

import { IOT_THING_MOCK } from '../../../../../testing/mocks';
import {
  getStompStatus,
  getThing,
  getThingFailure,
  getThingSuccess,
  subscribeBroadcastSuccess,
} from '../../actions/thing/thing.actions';
import { initialState, reducer, thingReducer } from './thing.reducer';

describe('Search Reducer', () => {
  describe('getThing', () => {
    test('should set loading', () => {
      const action = getThing({ thingId: 123 });
      const state = thingReducer(initialState, action);

      expect(state.thing.loading).toBeTruthy();
    });
  });

  describe('getThingSuccess', () => {
    test('should unset loading and set thing', () => {
      const action = getThingSuccess({ thing: IOT_THING_MOCK });

      const fakeState = {
        ...initialState,
        thing: { ...initialState.thing, loading: true },
      };

      const state = thingReducer(fakeState, action);

      expect(state.thing.loading).toBeFalsy();
      expect(state.thing.thing).toEqual(IOT_THING_MOCK);
    });
  });

  describe('getThingFailure', () => {
    test('should unset loading', () => {
      const action = getThingFailure();
      const fakeState = {
        ...initialState,
        thing: { ...initialState.thing, loading: true },
      };

      const state = thingReducer(fakeState, action);

      expect(state.thing.loading).toBeFalsy();
    });
  });

  describe('getStompStatus', () => {
    test('should set stomp status', () => {
      const testStatus = 1;
      const action = getStompStatus({ status: testStatus });
      const fakeState = {
        ...initialState,
      };

      const state = thingReducer(fakeState, action);

      expect(state.thing.socketStatus).toEqual(testStatus);
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

      const state = thingReducer(fakeState, action);

      expect(state.thing.messages).toEqual(expectedMessages);
    });
  });

  describe('Reducer function', () => {
    test('should return thingReducer', () => {
      // prepare any action
      const action: Action = getThingFailure();
      expect(reducer(initialState, action)).toEqual(
        thingReducer(initialState, action)
      );
    });
  });
});
