import { Action, createReducer, on } from '@ngrx/store';

import {
  loadSapPriceDetails,
  loadSapPriceDetailsFailure,
  loadSapPriceDetailsSuccess,
} from '../../actions/sap-price-details/sap-price-details.actions';
import { SapPriceDetail } from './models/sap-price-detail.model';

export interface SapPriceDetailsState {
  gqPositionId: string;
  sapPriceDetails: SapPriceDetail[];
  sapPriceDetailsLoading: boolean;
  errorMessage: string;
}

export const initialState: SapPriceDetailsState = {
  gqPositionId: undefined,
  sapPriceDetails: [],
  errorMessage: undefined,
  sapPriceDetailsLoading: false,
};

export const sapPriceDetailsReducer = createReducer(
  initialState,
  on(
    loadSapPriceDetails,
    (state: SapPriceDetailsState, { gqPositionId }): SapPriceDetailsState => ({
      ...state,
      gqPositionId,
      sapPriceDetailsLoading: true,
      sapPriceDetails: initialState.sapPriceDetails,
      errorMessage: undefined,
    })
  ),
  on(
    loadSapPriceDetailsSuccess,
    (
      state: SapPriceDetailsState,
      { sapPriceDetails }
    ): SapPriceDetailsState => ({
      ...state,
      sapPriceDetails,
      errorMessage: undefined,
      sapPriceDetailsLoading: false,
    })
  ),
  on(
    loadSapPriceDetailsFailure,
    (state: SapPriceDetailsState, { errorMessage }): SapPriceDetailsState => ({
      ...state,
      errorMessage,
      sapPriceDetails: initialState.sapPriceDetails,
      sapPriceDetailsLoading: false,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: SapPriceDetailsState,
  action: Action
): SapPriceDetailsState {
  return sapPriceDetailsReducer(state, action);
}
