import { PlantMaterialDetail } from '@gq/shared/models/quotation-detail';
import { createSelector } from '@ngrx/store';

import { getPlantMaterialDetailsState } from '../../reducers';
import { PlantMaterialDetailsState } from '../../reducers/plant-material-details/plant-material-details.reducer';

export const getPlantMaterialDetails = createSelector(
  getPlantMaterialDetailsState,
  (state: PlantMaterialDetailsState): PlantMaterialDetail[] =>
    state.plantMaterialDetails
);

export const getPlantMaterialDetailsLoading = createSelector(
  getPlantMaterialDetailsState,
  (state: PlantMaterialDetailsState): boolean =>
    state.plantMaterialDetailsLoading
);
