import { MATERIAL_COMPARABLE_COSTS_STATE_MOCK } from '../../../../../testing/mocks/state';
import * as materialComparableCostsSelectors from './material-comparable-costs.selector';

describe('material-comparable-costs Selector', () => {
  const fakeState = MATERIAL_COMPARABLE_COSTS_STATE_MOCK;

  describe('get material-comparable-costs', () => {
    test('should return materialComparableCosts', () => {
      expect(
        materialComparableCostsSelectors.getMaterialComparableCosts.projector(
          fakeState
        )
      ).toEqual(fakeState.materialComparableCosts);
    });
  });
  describe('getT material-comparable-costs loading', () => {
    test('should return materialComparableCostsLoading', () => {
      expect(
        materialComparableCostsSelectors.getMaterialComparableCostsLoading.projector(
          fakeState
        )
      ).toEqual(fakeState.materialComparableCostsLoading);
    });
  });
});
