import { PlantMaterialDetail } from '@gq/shared/models/quotation-detail/plant-material-detail.model';
import { createAction, props, union } from '@ngrx/store';

export const loadPlantMaterialDetails = createAction(
  '[Plant Material Details] Load Plant Material Details',
  props<{ materialId: string; plantIds: string[] }>()
);

export const loadPlantMaterialDetailsSuccess = createAction(
  '[Plant Material Details] Load Plant Material Details Success',
  props<{ plantMaterialDetails: PlantMaterialDetail[] }>()
);

export const loadPlantMaterialDetailsFailure = createAction(
  '[Plant Material Details] Load Plant Material Details Failure',
  props<{ errorMessage: string }>()
);

export const resetPlantMaterialDetails = createAction(
  '[Plant Material Details] Reset Plant Material Details'
);

const all = union({
  loadPlantMaterialDetails,
  loadPlantMaterialDetailsSuccess,
  loadPlantMaterialDetailsFailure,
  resetPlantMaterialDetails,
});

export type PlantMaterialDetailsActions = typeof all;
