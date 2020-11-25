import { createSelector } from '@ngrx/store';

import * as fromStore from '../reducers';

export const getMaterials = createSelector(
  fromStore.getInputState,
  (input) => input.materials
);

export const getMaterialList = createSelector(getMaterials, (materials) => [
  ...new Set(materials.map((material) => material.name)),
]);

export const getSelectedMaterial = createSelector(
  fromStore.getInputState,
  (input) => input.selectedMaterial
);

export const getHeatTreatmentList = createSelector(
  getMaterials,
  getSelectedMaterial,
  (materials, selectedMaterial) =>
    materials
      .map((material) =>
        material.name === selectedMaterial
          ? material
          : { ...material, disabled: true }
      )
      .sort((a, b) => (a.disabled === b.disabled ? 0 : b.disabled ? -1 : 1))
  // filter duplicate heattreatments when more materials use them
);

export const getPredictions = createSelector(
  fromStore.getInputState,
  (input) => input.predictions
);

export const getBurdeningTypes = createSelector(
  fromStore.getInputState,
  (input) => input.burdeningTypes
);

export const getDisplay = createSelector(
  fromStore.getInputState,
  (input) => input.display
);

export const getBannerVisible = createSelector(
  getDisplay,
  (display) => display.bannerOpen
);
