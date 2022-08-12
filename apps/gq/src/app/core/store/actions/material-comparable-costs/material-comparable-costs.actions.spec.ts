import { MaterialComparableCost } from '../../../../shared/models/quotation-detail/material-comparable-cost.model';
import {
  loadMaterialComparableCosts,
  loadMaterialComparableCostsFailure,
  loadMaterialComparableCostsSuccess,
  MaterialComparableCostsActions,
} from './material-comparable-costs.actions';

describe('MaterialComparableCost Action', () => {
  let action: MaterialComparableCostsActions;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;
    errorMessage = 'An error occurred';
  });

  describe('loadMaterialComparableCosts', () => {
    test('fetch', () => {
      const gqPositionId = '123';
      action = loadMaterialComparableCosts({ gqPositionId });
      expect(action).toEqual({
        gqPositionId,
        type: '[Material Comparable Costs] Load Material Comparable Costs For Quotation Detail',
      });
    });
    test('fetch success', () => {
      const materialComparableCosts: MaterialComparableCost[] = [];
      action = loadMaterialComparableCostsSuccess({
        materialComparableCosts,
      });
      expect(action).toEqual({
        materialComparableCosts,
        type: '[Material Comparable Costs] Load Material Comparable Costs For Quotation Detail Success',
      });
    });
    test('fetch failure', () => {
      action = loadMaterialComparableCostsFailure({ errorMessage });
      expect(action).toEqual({
        errorMessage,
        type: '[Material Comparable Costs] Load Material Comparable Costs For Quotation Detail Failure',
      });
    });
  });
});
