import { Action, createAction, props } from '@ngrx/store';

import {
  initialState,
  productSelectionReducer,
  reducer,
} from './product-selection.reducer';

describe('productSelectionReducer', () => {
  describe('Reducer function', () => {
    it('should return productSelectionReducer', () => {
      // prepare any action
      const action: Action = createAction(
        '[Mock] Action',
        props<{ query: string }>()
      );

      expect(reducer(initialState, action)).toEqual(
        productSelectionReducer(initialState, action)
      );
    });
  });
});
