import { Action, createAction, props } from '@ngrx/store';

import { initialState, reducer, settingsReducer } from './settings.reducer';

describe('settingsReducer', () => {
  describe('Reducer function', () => {
    it('should return settingsReducer', () => {
      // prepare any action
      const action: Action = createAction(
        '[Mock] Action',
        props<{ query: string }>()
      );

      expect(reducer(initialState, action)).toEqual(
        settingsReducer(initialState, action)
      );
    });
  });
});
