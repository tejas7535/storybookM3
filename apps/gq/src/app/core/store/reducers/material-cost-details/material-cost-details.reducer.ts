import { Action, createReducer, on } from '@ngrx/store';

import { MaterialCostDetails } from '../../../../shared/models/quotation-detail/material-cost-details';
import {
  loadMaterialCostDetails,
  loadMaterialCostDetailsFailure,
  loadMaterialCostDetailsSuccess,
  resetMaterialCostDetails,
} from '../../actions';

export interface MaterialCostDetailsState {
  materialCostDetails: MaterialCostDetails;
  materialCostDetailsLoading: boolean;
  errorMessage: string;
}

export const initialState: MaterialCostDetailsState = {
  materialCostDetails: undefined,
  materialCostDetailsLoading: false,
  errorMessage: undefined,
};

export const materialCostDetailsReducer = createReducer(
  initialState,
  on(
    loadMaterialCostDetails,
    (state: MaterialCostDetailsState): MaterialCostDetailsState => ({
      ...state,
      materialCostDetails: undefined,
      materialCostDetailsLoading: true,
      errorMessage: undefined,
    })
  ),
  on(
    loadMaterialCostDetailsSuccess,
    (
      state: MaterialCostDetailsState,
      { materialCostDetails }
    ): MaterialCostDetailsState => ({
      ...state,
      materialCostDetails,
      materialCostDetailsLoading: false,
      errorMessage: undefined,
    })
  ),
  on(
    loadMaterialCostDetailsFailure,
    (
      state: MaterialCostDetailsState,
      { errorMessage }
    ): MaterialCostDetailsState => ({
      ...state,
      materialCostDetailsLoading: false,
      errorMessage,
    })
  ),
  on(resetMaterialCostDetails, (): MaterialCostDetailsState => initialState)
);

export function reducer(
  state: MaterialCostDetailsState,
  action: Action
): MaterialCostDetailsState {
  return materialCostDetailsReducer(state, action);
}
