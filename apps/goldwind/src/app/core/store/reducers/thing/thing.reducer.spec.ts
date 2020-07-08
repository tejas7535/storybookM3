import { Action } from '@ngrx/store';

import {
  getThing,
  getThingFailure,
  getThingSuccess,
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
      const testThing = {
        name: 'Testthing',
        description: 'Does amazing stuff',
      };

      const action = getThingSuccess({ thing: testThing });

      const fakeState = {
        ...initialState,
        thing: { ...initialState.thing, loading: true },
      };

      const state = thingReducer(fakeState, action);

      expect(state.thing.loading).toBeFalsy();
      expect(state.thing.thing).toEqual(testThing);
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
