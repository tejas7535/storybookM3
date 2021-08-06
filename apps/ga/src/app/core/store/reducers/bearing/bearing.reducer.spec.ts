import { Action } from '@ngrx/store';

import { searchBearing } from '../../actions/bearing/bearing.actions';
import { bearingReducer, initialState, reducer } from './bearing.reducer';

describe('Bearing Reducer', () => {
  describe('Reducer function', () => {
    it('should return bearingReducer', () => {
      // prepare any action
      const action: Action = searchBearing({ query: 'mockQuery' });
      expect(reducer(initialState, action)).toEqual(
        bearingReducer(initialState, action)
      );
    });
  });
});
