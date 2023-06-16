import { MaterialComparableCost } from '@gq/shared/models/quotation-detail/material-comparable-cost.model';
import { Action, createReducer, on } from '@ngrx/store';

import {
  loadMaterialComparableCosts,
  loadMaterialComparableCostsFailure,
  loadMaterialComparableCostsSuccess,
} from '../../actions';

export interface MaterialComparableCostsState {
  gqPositionId: string;
  materialComparableCosts: MaterialComparableCost[];
  materialComparableCostsLoading: boolean;
  errorMessage: string;
}

export const initialState: MaterialComparableCostsState = {
  gqPositionId: undefined,
  materialComparableCosts: [],
  materialComparableCostsLoading: false,
  errorMessage: undefined,
};

export const materialComparableCostsReducer = createReducer(
  initialState,
  on(
    loadMaterialComparableCosts,
    (
      state: MaterialComparableCostsState,
      { gqPositionId }
    ): MaterialComparableCostsState => ({
      ...state,
      gqPositionId,
      materialComparableCosts: [],
      materialComparableCostsLoading: true,
    })
  ),
  on(
    loadMaterialComparableCostsSuccess,
    (
      state: MaterialComparableCostsState,
      { materialComparableCosts }
    ): MaterialComparableCostsState => ({
      ...state,
      materialComparableCosts,
      errorMessage: undefined,
      materialComparableCostsLoading: false,
    })
  ),
  on(
    loadMaterialComparableCostsFailure,
    (
      state: MaterialComparableCostsState,
      { errorMessage }
    ): MaterialComparableCostsState => ({
      ...state,
      errorMessage,
      materialComparableCosts: [],
      materialComparableCostsLoading: false,
    })
  )
);

export function reducer(
  state: MaterialComparableCostsState,
  action: Action
): MaterialComparableCostsState {
  return materialComparableCostsReducer(state, action);
}
