import { PlantMaterialDetail } from '@gq/shared/models/quotation-detail/plant-material-detail.model';

import {
  loadPlantMaterialDetails,
  loadPlantMaterialDetailsFailure,
  loadPlantMaterialDetailsSuccess,
  PlantMaterialDetailsActions,
  resetPlantMaterialDetails,
} from './plant-material-details.actions';

describe('PlantMaterialDetails Action', () => {
  let action: PlantMaterialDetailsActions;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;
    errorMessage = 'An error occurred';
  });

  describe('loadPlantMaterialDetails', () => {
    test('fetch', () => {
      const materialId = '123';
      const plantIds = ['456', '789'];

      action = loadPlantMaterialDetails({ materialId, plantIds });
      expect(action).toEqual({
        materialId,
        plantIds,
        type: '[Plant Material Details] Load Plant Material Details',
      });
    });
    test('fetch success', () => {
      const plantMaterialDetails: PlantMaterialDetail[] = [];
      action = loadPlantMaterialDetailsSuccess({
        plantMaterialDetails,
      });
      expect(action).toEqual({
        plantMaterialDetails,
        type: '[Plant Material Details] Load Plant Material Details Success',
      });
    });
    test('fetch failure', () => {
      action = loadPlantMaterialDetailsFailure({ errorMessage });
      expect(action).toEqual({
        errorMessage,
        type: '[Plant Material Details] Load Plant Material Details Failure',
      });
    });
    test('resetPlantMaterialDetails', () => {
      action = resetPlantMaterialDetails();

      expect(action).toEqual({
        type: '[Plant Material Details] Reset Plant Material Details',
      });
    });
  });
});
