import { createSelector } from '@ngrx/store';

import * as fromStore from '../reducers';

export const getInputState = createSelector(
  fromStore.getLTPState,
  (ltpState) => ltpState.input
);

export const getMaterials = createSelector(
  getInputState,
  (input) => input.materials
);

export const getMaterialList = createSelector(getMaterials, (materials) => [
  ...new Set(materials.map((material) => material.name)),
]);

export const getSelectedMaterial = createSelector(
  getInputState,
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
      .sort((a, b) => {
        const value = b.disabled ? -1 : 1;

        return a.disabled === b.disabled ? 0 : value;
      })
  // filter duplicate heattreatments when more materials use them
);

export const getPredictions = createSelector(
  getInputState,
  (input) => input.predictions
);

export const getBurdeningTypes = createSelector(
  getInputState,
  (input) => input.burdeningTypes
);

export const getDisplay = createSelector(
  getInputState,
  (input) => input.display
);

export const getBannerVisible = createSelector(
  getDisplay,
  (display) => display.bannerOpen
);
