import { ProductSelectionState } from '@ea/core/store/models';
import { Action, createReducer } from '@ngrx/store';

export const initialState: ProductSelectionState = {};

export const productSelectionReducer = createReducer(initialState);

export function reducer(
  state: ProductSelectionState,
  action: Action
): ProductSelectionState {
  return productSelectionReducer(state, action);
}
