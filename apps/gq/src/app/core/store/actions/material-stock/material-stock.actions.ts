import { createAction, props, union } from '@ngrx/store';

import { MaterialStock } from '../../reducers/material-stock/models/material-stock.model';

export const loadMaterialStock = createAction(
  '[Material Stock] Get Material Stock by Production Plant and Material Number',
  props<{ productionPlantId: string; materialNumber15: string }>()
);
export const loadMaterialStockSuccess = createAction(
  '[Material Stock] Get Material Stock by Production Plant and Material Number Success',
  props<{ materialStock: MaterialStock }>()
);
export const loadMaterialStockFailure = createAction(
  '[Material Stock] Get Material Stock by Production Plant and Material Number Failure',
  props<{ errorMessage: string }>()
);

export const resetMaterialStock = createAction(
  '[Material Stock] Reset Material Stock Store'
);
const all = union({
  loadMaterialStock,
  loadMaterialStockSuccess,
  loadMaterialStockFailure,
  resetMaterialStock,
});

export type MaterialStockActions = typeof all;
