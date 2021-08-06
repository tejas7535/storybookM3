import { Action } from '@ngrx/store';

import { searchBearing } from '../../actions/bearing/bearing.actions';
import { initialState, parameterReducer, reducer } from './parameter.reducer';

describe('Parameter Reducer', () => {
  describe('Reducer function', () => {
    it('should return parameterReducer', () => {
      // prepare any action
      const action: Action = searchBearing({ query: 'mockQuery' }); // TODO: replace with parameter action
      expect(reducer(initialState, action)).toEqual(
        parameterReducer(initialState, action)
      );
    });
  });
});
