import { materialAlternativeCostsReducer } from './material-alternative-costs.reducer';
import { MATERIAL_ALTERNATIVE_COSTS_STATE_MOCK } from '../../../../../testing/mocks/material-alternative-cost-state.mock';
import {
  loadMaterialAlternativeCosts,
  loadMaterialAlternativeCostsFailure,
  loadMaterialAlternativeCostsSuccess,
} from '../../actions';
import { MATERIAL_ALTERNATIVE_COST_MOCK } from '../../../../../testing/mocks/material-alternative-cost.mock';

describe('materialAlternativeCostsReducer', () => {
  describe('loadMaterialAlternativeCosts', () => {
    test('should set materialAlternativeCostsLoading', () => {
      const gqPositionId = '1234';

      expect(
        materialAlternativeCostsReducer(
          MATERIAL_ALTERNATIVE_COSTS_STATE_MOCK,
          loadMaterialAlternativeCosts({ gqPositionId })
        )
      ).toEqual({
        ...MATERIAL_ALTERNATIVE_COSTS_STATE_MOCK,
        gqPositionId,
        materialAlternativeCostsLoading: true,
      });
    });
  });
  describe('loadMaterialAlternativeCostsSuccess', () => {
    test('should set materialAlternativeCosts', () => {
      const materialAlternativeCosts = [MATERIAL_ALTERNATIVE_COST_MOCK];

      expect(
        materialAlternativeCostsReducer(
          MATERIAL_ALTERNATIVE_COSTS_STATE_MOCK,
          loadMaterialAlternativeCostsSuccess({
            materialAlternativeCosts,
          })
        )
      ).toEqual({
        ...MATERIAL_ALTERNATIVE_COSTS_STATE_MOCK,
        materialAlternativeCosts,
      });
    });
  });
  describe('loadMaterialAlternativeCostsFailure', () => {
    test('should set errorMessage', () => {
      const errorMessage = 'error';

      expect(
        materialAlternativeCostsReducer(
          MATERIAL_ALTERNATIVE_COSTS_STATE_MOCK,
          loadMaterialAlternativeCostsFailure({ errorMessage })
        )
      ).toEqual({
        ...MATERIAL_ALTERNATIVE_COSTS_STATE_MOCK,
        errorMessage,
      });
    });
  });
});
