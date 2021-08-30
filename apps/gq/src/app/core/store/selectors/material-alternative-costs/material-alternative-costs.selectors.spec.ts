import * as materialAlternativeCostsSelectors from './material-alternative-costs.selector';
import { MATERIAL_ALTERNATIVE_COSTS_STATE_MOCK } from '../../../../../testing/mocks/material-alternative-cost-state.mock';

describe('material-alternative-costs Selector', () => {
  const fakeState = MATERIAL_ALTERNATIVE_COSTS_STATE_MOCK;

  describe('get material-alternative-costs', () => {
    test('should return materialAlternativeCosts', () => {
      expect(
        materialAlternativeCostsSelectors.getMaterialAlternativeCosts.projector(
          fakeState
        )
      ).toEqual(fakeState.materialAlternativeCosts);
    });
  });
  describe('getT material-alternative-costs loading', () => {
    test('should return materialAlternativeCostsLoading', () => {
      expect(
        materialAlternativeCostsSelectors.getMaterialAlternativeCostsLoading.projector(
          fakeState
        )
      ).toEqual(fakeState.materialAlternativeCostsLoading);
    });
  });
});
