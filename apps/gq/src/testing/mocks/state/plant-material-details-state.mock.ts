import { PlantMaterialDetailsState } from '../../../app/core/store/reducers/plant-material-details/plant-material-details.reducer';

export const PLANT_MATERIAL_DETAILS_STATE_MOCK: PlantMaterialDetailsState = {
  plantMaterialDetails: [
    { material: '123456789012345', plantId: '12345', stochasticType: 'A' },
    { material: '123456789012345', plantId: '67890', stochasticType: 'H' },
  ],
  plantMaterialDetailsLoading: false,
  errorMessage: undefined,
};
