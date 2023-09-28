import { Action } from '@ngrx/store';

import { MATERIAL_COST_DETAILS_MOCK } from '../../../../../testing/mocks/models/material-cost-details.mock';
import { MATERIAL_COST_DETAILS_STATE_MOCK } from '../../../../../testing/mocks/state/material-cost-details-state.mock';
import {
  loadMaterialCostDetails,
  loadMaterialCostDetailsFailure,
  loadMaterialCostDetailsSuccess,
  resetMaterialCostDetails,
} from '../../actions';
import {
  initialState,
  materialCostDetailsReducer,
  reducer,
} from './material-cost-details.reducer';

describe('Material Cost Details Reducer', () => {
  describe('loadMaterialCostDetails', () => {
    test('should trigger loadMaterialCostDetails', () => {
      const fakeState = MATERIAL_COST_DETAILS_STATE_MOCK;

      const materialNumber15 = '123456789012345';
      const productionPlantId = '0251';
      const plantId = '1234';

      const action = loadMaterialCostDetails({
        materialNumber15,
        productionPlantId,
        plantId,
      });

      const state = materialCostDetailsReducer(fakeState, action);

      expect(state.materialCostDetailsLoading).toBeTruthy();
    });
  });
  describe('loadMaterialCostDetailsSuccess', () => {
    test('should load MaterialCostDetails in store', () => {
      const fakeState = {
        ...MATERIAL_COST_DETAILS_STATE_MOCK,
        materialCostDetails: undefined as any,
        materialCostDetailsLoading: true,
      };

      const materialCostDetails = MATERIAL_COST_DETAILS_MOCK;

      const action = loadMaterialCostDetailsSuccess({ materialCostDetails });

      const state = materialCostDetailsReducer(fakeState, action);

      expect(state.materialCostDetailsLoading).toBeFalsy();
      expect(state.materialCostDetails).toEqual(materialCostDetails);
    });
  });
  describe('loadMaterialCostDetailsFailure', () => {
    test('should load error message in store', () => {
      const errorMessage = 'errorMessage';

      const fakeState = {
        ...MATERIAL_COST_DETAILS_STATE_MOCK,
        materialCostDetails: undefined as any,
        materialCostDetailsLoading: true,
      };

      const action = loadMaterialCostDetailsFailure({ errorMessage });

      const state = materialCostDetailsReducer(fakeState, action);

      expect(state.materialCostDetailsLoading).toBeFalsy();
      expect(state.errorMessage).toEqual(errorMessage);
    });
    describe('resetMaterialCostDetails', () => {
      test('should set state to initalstate', () => {
        const action = resetMaterialCostDetails();

        const state = materialCostDetailsReducer(
          { ...MATERIAL_COST_DETAILS_STATE_MOCK },
          action
        );

        expect(state).toEqual(initialState);
      });
    });
  });
  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = loadMaterialCostDetails({
        materialNumber15: '1',
        productionPlantId: '2',
        plantId: '3',
      });
      expect(reducer(MATERIAL_COST_DETAILS_STATE_MOCK, action)).toEqual(
        materialCostDetailsReducer(MATERIAL_COST_DETAILS_STATE_MOCK, action)
      );
    });
  });
});
