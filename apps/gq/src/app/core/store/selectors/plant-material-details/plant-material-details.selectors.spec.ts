import { PLANT_MATERIAL_DETAILS_STATE_MOCK } from '../../../../../testing/mocks';
import * as plantMaterialDetailsSelectors from './plant-material-details.selectors';

describe('Plant Material Details', () => {
  const fakeState = {
    plantMaterialDetails: PLANT_MATERIAL_DETAILS_STATE_MOCK,
  };

  describe('getPlantMaterialDetails', () => {
    test('should return plant material details', () => {
      expect(
        plantMaterialDetailsSelectors.getPlantMaterialDetails.projector(
          fakeState.plantMaterialDetails
        )
      ).toEqual(fakeState.plantMaterialDetails.plantMaterialDetails);
    });
  });
  describe('getMaterialDetailsLoading', () => {
    test('should return plant material details loading', () => {
      expect(
        plantMaterialDetailsSelectors.getPlantMaterialDetailsLoading.projector(
          fakeState.plantMaterialDetails
        )
      ).toEqual(fakeState.plantMaterialDetails.plantMaterialDetailsLoading);
    });
  });
});
