import { Action } from '@ngrx/store';

import { PLANT_MATERIAL_DETAILS_STATE_MOCK } from '../../../../../testing/mocks';
import {
  loadPlantMaterialDetails,
  loadPlantMaterialDetailsFailure,
  loadPlantMaterialDetailsSuccess,
  resetPlantMaterialDetails,
} from '../../actions/plant-material-details/plant-material-details.actions';
import {
  plantMaterialDetailsReducer,
  reducer,
} from './plant-material-details.reducer';

describe('Plant Material Details Reducer', () => {
  describe('loadPlantMaterialDetails', () => {
    test('should trigger loadPlantMaterialDetails', () => {
      const fakeState = PLANT_MATERIAL_DETAILS_STATE_MOCK;

      const materialId = '123456789012345';
      const productionPlantId = '0251';

      const action = loadPlantMaterialDetails({
        materialId,
        plantIds: [productionPlantId],
      });

      const state = plantMaterialDetailsReducer(fakeState, action);

      expect(state.plantMaterialDetailsLoading).toBeTruthy();
    });
  });
  describe('loadPlantMaterialDetailsSuccess', () => {
    test('should load plantMaterialDetails in store', () => {
      const fakeState = {
        ...PLANT_MATERIAL_DETAILS_STATE_MOCK,
        plantMaterialDetails: undefined as any,
        plantMaterialDetailsLoading: true,
      };

      const plantMaterialDetails =
        PLANT_MATERIAL_DETAILS_STATE_MOCK.plantMaterialDetails;

      const action = loadPlantMaterialDetailsSuccess({
        plantMaterialDetails,
      });

      const state = plantMaterialDetailsReducer(fakeState, action);

      expect(state.plantMaterialDetailsLoading).toBeFalsy();
      expect(state.plantMaterialDetails).toEqual(plantMaterialDetails);
    });
  });
  describe('loadPlantMaterialDetailsFailure', () => {
    test('should load error message in store', () => {
      const errorMessage = 'errorMessage';

      const fakeState = {
        ...PLANT_MATERIAL_DETAILS_STATE_MOCK,
        plantMaterialDetails: undefined as any,
        plantMaterialDetailsLoading: true,
      };

      const action = loadPlantMaterialDetailsFailure({ errorMessage });

      const state = plantMaterialDetailsReducer(fakeState, action);

      expect(state.plantMaterialDetailsLoading).toBeFalsy();
      expect(state.errorMessage).toEqual(errorMessage);
    });
  });
  describe('resetPlantMaterialDetails', () => {
    test('should reset plant material details', () => {
      const fakeState = {
        ...PLANT_MATERIAL_DETAILS_STATE_MOCK,
      };

      const action = resetPlantMaterialDetails();

      const state = plantMaterialDetailsReducer(fakeState, action);

      expect(state.plantMaterialDetailsLoading).toBeFalsy();
      expect(state.errorMessage).toEqual(undefined);
      expect(state.plantMaterialDetails).toEqual([]);
    });
  });

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = loadPlantMaterialDetails({
        materialId: '123456789012345',
        plantIds: ['2'],
      });
      expect(reducer(PLANT_MATERIAL_DETAILS_STATE_MOCK, action)).toEqual(
        plantMaterialDetailsReducer(PLANT_MATERIAL_DETAILS_STATE_MOCK, action)
      );
    });
  });
});
