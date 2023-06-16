import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { Action, createReducer, on } from '@ngrx/store';

import {
  loadMaterialSalesOrg,
  loadMaterialSalesOrgFailure,
  loadMaterialSalesOrgSuccess,
} from '../../actions';

export interface MaterialSalesOrgsState {
  gqPositionId: string;
  materialSalesOrg: MaterialSalesOrg;
  materialSalesOrgLoading: boolean;
  errorMessage: string;
}

export const initialState: MaterialSalesOrgsState = {
  gqPositionId: undefined,
  materialSalesOrg: undefined,
  materialSalesOrgLoading: false,
  errorMessage: undefined,
};

export const materialSalesOrgReducer = createReducer(
  initialState,
  on(
    loadMaterialSalesOrg,
    (
      state: MaterialSalesOrgsState,
      { gqPositionId }
    ): MaterialSalesOrgsState => ({
      ...state,
      gqPositionId,
      materialSalesOrg: undefined,
      materialSalesOrgLoading: true,
    })
  ),
  on(
    loadMaterialSalesOrgSuccess,
    (
      state: MaterialSalesOrgsState,
      { materialSalesOrg }
    ): MaterialSalesOrgsState => ({
      ...state,
      materialSalesOrg,
      errorMessage: undefined,
      materialSalesOrgLoading: false,
    })
  ),
  on(
    loadMaterialSalesOrgFailure,
    (
      state: MaterialSalesOrgsState,
      { errorMessage }
    ): MaterialSalesOrgsState => ({
      ...state,
      errorMessage,
      materialSalesOrg: undefined,
      materialSalesOrgLoading: false,
    })
  )
);

export function reducer(
  state: MaterialSalesOrgsState,
  action: Action
): MaterialSalesOrgsState {
  return materialSalesOrgReducer(state, action);
}
