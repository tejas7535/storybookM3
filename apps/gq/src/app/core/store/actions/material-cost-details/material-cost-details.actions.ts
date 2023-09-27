import { MaterialCostDetails } from '@gq/shared/models/quotation-detail/material-cost-details';
import { createAction, props, union } from '@ngrx/store';

export const loadMaterialCostDetails = createAction(
  '[Material Cost Details] Get Material Cost Details by Production Plant and Material Number',
  props<{
    productionPlantId: string;
    plantId: string;
    materialNumber15: string;
  }>()
);
export const loadMaterialCostDetailsSuccess = createAction(
  '[Material Cost Details] Get Material Cost Details by Production Plant and Material Number Success',
  props<{ materialCostDetails: MaterialCostDetails }>()
);
export const loadMaterialCostDetailsFailure = createAction(
  '[Material Cost Details] Get Material Cost Details by Production Plant and Material Number Failure',
  props<{ errorMessage: string }>()
);

export const resetMaterialCostDetails = createAction(
  '[Material Cost Details] Reset Material Cost Details Store'
);
const all = union({
  loadMaterialCostDetails,
  loadMaterialCostDetailsSuccess,
  loadMaterialCostDetailsFailure,
  resetMaterialCostDetails,
});

export type MaterialCostDetailsActions = typeof all;
