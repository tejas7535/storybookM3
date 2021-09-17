import { Action, createReducer, on } from '@ngrx/store';

import { MaterialAlternativeCost } from '../../../../shared/models/quotation-detail/material-alternative-cost.model';
import {
  loadMaterialAlternativeCosts,
  loadMaterialAlternativeCostsFailure,
  loadMaterialAlternativeCostsSuccess,
} from '../../actions';

export interface MaterialAlternativeCostsState {
  gqPositionId: string;
  materialAlternativeCosts: MaterialAlternativeCost[];
  materialAlternativeCostsLoading: boolean;
  errorMessage: string;
}

export const initialState: MaterialAlternativeCostsState = {
  gqPositionId: undefined,
  materialAlternativeCosts: [],
  materialAlternativeCostsLoading: false,
  errorMessage: undefined,
};

export const materialAlternativeCostsReducer = createReducer(
  initialState,
  on(
    loadMaterialAlternativeCosts,
    (
      state: MaterialAlternativeCostsState,
      { gqPositionId }
    ): MaterialAlternativeCostsState => ({
      ...state,
      gqPositionId,
      materialAlternativeCosts: [],
      materialAlternativeCostsLoading: true,
    })
  ),
  on(
    loadMaterialAlternativeCostsSuccess,
    (
      state: MaterialAlternativeCostsState,
      { materialAlternativeCosts }
    ): MaterialAlternativeCostsState => ({
      ...state,
      materialAlternativeCosts,
      errorMessage: undefined,
      materialAlternativeCostsLoading: false,
    })
  ),
  on(
    loadMaterialAlternativeCostsFailure,
    (
      state: MaterialAlternativeCostsState,
      { errorMessage }
    ): MaterialAlternativeCostsState => ({
      ...state,
      errorMessage,
      materialAlternativeCosts: [],
      materialAlternativeCostsLoading: false,
    })
  )
);

export function reducer(
  state: MaterialAlternativeCostsState,
  action: Action
): MaterialAlternativeCostsState {
  return materialAlternativeCostsReducer(state, action);
}
