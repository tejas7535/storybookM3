import { createSelector } from '@ngrx/store';

import { getMaterialStockState } from '../../reducers';
import { MaterialStockState } from '../../reducers/material-stock/material-stock.reducer';
import { MaterialStock } from '../../reducers/material-stock/models/material-stock.model';

export const getMaterialStock = createSelector(
  getMaterialStockState,
  (state: MaterialStockState): MaterialStock => state.materialStock
);

export const getMaterialStockLoading = createSelector(
  getMaterialStockState,
  (state: MaterialStockState): boolean => state.materialStockLoading
);
