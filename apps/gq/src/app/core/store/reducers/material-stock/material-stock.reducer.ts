import { Action, createReducer, on } from '@ngrx/store';

import {
  loadMaterialStock,
  loadMaterialStockFailure,
  loadMaterialStockSuccess,
} from '../../actions/material-stock/material-stock.actions';
import { MaterialStock } from './models/material-stock.model';

export interface MaterialStockState {
  materialStock: MaterialStock;
  materialStockLoading: boolean;
  errorMessage: string;
}

export const initialState: MaterialStockState = {
  materialStock: undefined,
  materialStockLoading: false,
  errorMessage: undefined,
};

export const materialStockReducer = createReducer(
  initialState,
  on(
    loadMaterialStock,
    (state: MaterialStockState): MaterialStockState => ({
      ...state,
      materialStock: undefined,
      materialStockLoading: true,
      errorMessage: undefined,
    })
  ),
  on(
    loadMaterialStockSuccess,
    (state: MaterialStockState, { materialStock }): MaterialStockState => ({
      ...state,
      materialStock,
      materialStockLoading: false,
      errorMessage: undefined,
    })
  ),
  on(
    loadMaterialStockFailure,
    (state: MaterialStockState, { errorMessage }): MaterialStockState => ({
      ...state,
      materialStockLoading: false,
      errorMessage,
    })
  )
);

export function reducer(
  state: MaterialStockState,
  action: Action
): MaterialStockState {
  return materialStockReducer(state, action);
}
