import { Action, createAction, props } from '@ngrx/store';

import {
  calculationResultReducer,
  initialState,
  reducer,
} from './calculation-result.reducer';

describe('calculationResultReducer', () => {
  describe('Reducer function', () => {
    it('should return calculationResultReducer', () => {
      // prepare any action
      const action: Action = createAction(
        '[Mock] Action',
        props<{ query: string }>()
      );

      expect(reducer(initialState, action)).toEqual(
        calculationResultReducer(initialState, action)
      );
    });
  });
});
