import { Action } from '@ngrx/store';

import { searchBearing } from '../../actions/bearing/bearing.actions';
import { initialState, reducer, settingsReducer } from './settings.reducer';

describe('Settings Reducer', () => {
  describe('Reducer function', () => {
    it('should return settingsReducer', () => {
      // prepare any action
      const action: Action = searchBearing({ query: 'mockQuery' }); // TODO: replace with settings action
      expect(reducer(initialState, action)).toEqual(
        settingsReducer(initialState, action)
      );
    });
  });
});
