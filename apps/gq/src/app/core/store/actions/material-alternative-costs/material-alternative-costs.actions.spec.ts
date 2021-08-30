import {
  loadMaterialAlternativeCosts,
  loadMaterialAlternativeCostsFailure,
  loadMaterialAlternativeCostsSuccess,
  MaterialAlternativeCostsActions,
} from './material-alternative-costs.actions';
import { MaterialAlternativeCost } from '../../../../shared/models/quotation-detail/material-alternative-cost.model';

describe('MaterialAlternativeCost Action', () => {
  let action: MaterialAlternativeCostsActions;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;
    errorMessage = 'An error occurred';
  });

  describe('loadMaterialAlternativeCosts', () => {
    test('fetch', () => {
      const gqPositionId = '123';
      action = loadMaterialAlternativeCosts({ gqPositionId });
      expect(action).toEqual({
        gqPositionId,
        type: '[Detail View] Load material alternative costs for Quotation Detail',
      });
    });
    test('fetch success', () => {
      const materialAlternativeCosts: MaterialAlternativeCost[] = [];
      action = loadMaterialAlternativeCostsSuccess({
        materialAlternativeCosts,
      });
      expect(action).toEqual({
        materialAlternativeCosts,
        type: '[Detail View] Load material alternative costs for  Quotation Detail Success',
      });
    });
    test('fetch failure', () => {
      action = loadMaterialAlternativeCostsFailure({ errorMessage });
      expect(action).toEqual({
        errorMessage,
        type: '[Detail View] Load material alternative costs for Quotation Detail Failure',
      });
    });
  });
});
