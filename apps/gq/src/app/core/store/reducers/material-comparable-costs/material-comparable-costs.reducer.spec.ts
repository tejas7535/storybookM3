import {
  MATERIAL_COMPARABLE_COST_MOCK,
  MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
} from '../../../../../testing/mocks';
import {
  loadMaterialComparableCosts,
  loadMaterialComparableCostsFailure,
  loadMaterialComparableCostsSuccess,
} from '../../actions';
import { materialComparableCostsReducer } from './material-comparable-costs.reducer';

describe('materialComparableCostsReducer', () => {
  describe('loadMaterialComparableCosts', () => {
    test('should set materialComparableCostsLoading', () => {
      const gqPositionId = '1234';

      expect(
        materialComparableCostsReducer(
          MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
          loadMaterialComparableCosts({ gqPositionId })
        )
      ).toEqual({
        ...MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
        gqPositionId,
        materialComparableCostsLoading: true,
      });
    });
  });
  describe('loadMaterialComparableCostsSuccess', () => {
    test('should set materialComparableCosts', () => {
      const materialComparableCosts = [MATERIAL_COMPARABLE_COST_MOCK];

      expect(
        materialComparableCostsReducer(
          MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
          loadMaterialComparableCostsSuccess({
            materialComparableCosts,
          })
        )
      ).toEqual({
        ...MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
        materialComparableCosts,
      });
    });
  });
  describe('loadMaterialComparableCostsFailure', () => {
    test('should set errorMessage', () => {
      const errorMessage = 'error';

      expect(
        materialComparableCostsReducer(
          MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
          loadMaterialComparableCostsFailure({ errorMessage })
        )
      ).toEqual({
        ...MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
        errorMessage,
      });
    });
  });
});
