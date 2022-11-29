import { MATERIAL_COST_DETAILS_MOCK } from '../../../../../testing/mocks';
import * as materialCostDetailsSelectors from './material-cost-details.selectors';

describe('Material Cost Details Selectors', () => {
  const fakeState = {
    materialCostDetails: {
      materialCostDetails: MATERIAL_COST_DETAILS_MOCK,
      materialCostDetailsLoading: false,
      errorMessage: 'errorMessage',
    },
  };

  describe('getMaterialCostDetails', () => {
    test('should return materialCostDetails', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostDetails.projector(
          fakeState.materialCostDetails
        )
      ).toEqual(fakeState.materialCostDetails.materialCostDetails);
    });
  });
  describe('getMaterialCostDetailsLoading', () => {
    test('should return materialCostDetails loading', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostDetailsLoading.projector(
          fakeState.materialCostDetails
        )
      ).toEqual(fakeState.materialCostDetails.materialCostDetailsLoading);
    });
  });
});
