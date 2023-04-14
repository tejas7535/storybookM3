import { createReducer, on } from '@ngrx/store';

import { ProductSelectionActions } from '../../actions';
import { ProductSelectionState } from '../../models';

export const initialState: ProductSelectionState = {};

export const productSelectionReducer = createReducer(
  initialState,
  on(
    ProductSelectionActions.setBearingDesignation,
    (state, { bearingDesignation }): ProductSelectionState => ({
      ...state,
      bearingDesignation,
      bearingId: undefined, // reset bearing id
      error: undefined,
    })
  ),
  on(
    ProductSelectionActions.setBearingId,
    (state, { bearingId }): ProductSelectionState => ({
      ...state,
      bearingId,
      error: undefined,
    })
  ),
  on(
    ProductSelectionActions.setProductFetchFailure,
    (state, { error }): ProductSelectionState => ({
      ...state,
      error,
    })
  )
);
