import { Action, createAction, props } from '@ngrx/store';

import { ProductSelectionActions } from '../../actions';
import { ProductSelectionState } from '../../models';
import {
  initialState,
  productSelectionReducer,
  reducer,
} from './product-selection.reducer';

describe('ProductSelectionReducer', () => {
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

  describe('setBearingDesignation', () => {
    it('should set the bearing designation', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
        bearingDesignation: 'abc',
      };

      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.setBearingDesignation({
          bearingDesignation: 'def',
        })
      );

      expect(newState).toEqual({
        ...initialState,
        bearingDesignation: 'def',
      });
    });
  });

  describe('setBearingId', () => {
    it('should set the bearing id', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
        bearingId: '123',
      };

      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.setBearingId({ bearingId: '456' })
      );

      expect(newState).toEqual({
        ...initialState,
        bearingId: '456',
      });
    });
  });

  describe('setProductFetchFailure', () => {
    it('should set the error', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
        error: 'error',
      };

      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.setProductFetchFailure({ error: 'error 2' })
      );

      expect(newState).toEqual({
        ...initialState,
        error: 'error 2',
      });
    });
  });
});
