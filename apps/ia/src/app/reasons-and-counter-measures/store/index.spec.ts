import { Action } from '@ngrx/store';

import { initialState, reasonsAndCounterMeasuresReducer, reducer } from '.';

describe('ReasonsAndCounterMeasures Reducer', () => {
  describe('Reducer function', () => {
    test('should return reasonsAndCounterMeasuresReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        reasonsAndCounterMeasuresReducer(initialState, action)
      );
    });
  });
});
