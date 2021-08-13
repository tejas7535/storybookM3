import { Action } from '@ngrx/store';

import { searchBearing } from '../../actions/bearing/bearing.actions';
import { initialState, reducer, resultReducer } from './result.reducer';

describe('Result Reducer', () => {
  describe('Reducer function', () => {
    it('should return resultReducer', () => {
      // prepare any action
      const action: Action = searchBearing({ query: 'mockQuery' }); // TODO: replace with result action
      expect(reducer(initialState, action)).toEqual(
        resultReducer(initialState, action)
      );
    });
  });
});
