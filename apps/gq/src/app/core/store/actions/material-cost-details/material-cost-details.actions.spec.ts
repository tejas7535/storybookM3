import { MATERIAL_COST_DETAILS_MOCK } from '../../../../../testing/mocks/models/material-cost-details.mock';
import {
  loadMaterialCostDetails,
  loadMaterialCostDetailsFailure,
  loadMaterialCostDetailsSuccess,
  resetMaterialCostDetails,
} from './material-cost-details.actions';
describe('Material Cost Details Actions', () => {
  test('loadMaterialCostDetails', () => {
    const materialNumber15 = '000025437000011';
    const productionPlantId = '0200';
    const action = loadMaterialCostDetails({
      materialNumber15,
      productionPlantId,
    });

    expect(action).toEqual({
      materialNumber15,
      productionPlantId,
      type: '[Material Cost Details] Get Material Cost Details by Production Plant and Material Number',
    });
  });
  test('loadMaterialCostDetailsSuccess', () => {
    const materialCostDetails = MATERIAL_COST_DETAILS_MOCK;

    const action = loadMaterialCostDetailsSuccess({
      materialCostDetails,
    });

    expect(action).toEqual({
      materialCostDetails,
      type: '[Material Cost Details] Get Material Cost Details by Production Plant and Material Number Success',
    });
  });

  test('loadMaterialCostDetailsFailure', () => {
    const errorMessage = 'errorMessage';
    const action = loadMaterialCostDetailsFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Material Cost Details] Get Material Cost Details by Production Plant and Material Number Failure',
    });
  });

  test('resetMaterialCostDetails', () => {
    const action = resetMaterialCostDetails();

    expect(action).toEqual({
      type: '[Material Cost Details] Reset Material Cost Details Store',
    });
  });
});
