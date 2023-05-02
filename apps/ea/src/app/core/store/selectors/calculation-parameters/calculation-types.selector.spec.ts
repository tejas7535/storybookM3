import { APP_STATE_MOCK } from '@ea/testing/mocks';

import {
  getCalculationTypesConfig,
  getCalculationTypesGlobalSelectionState,
} from './calculation-types.selector';

describe('Calculation Types Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
  };

  describe('getCalculationTypesGlobalSelectionState', () => {
    it('should return the operation conditions', () => {
      expect(
        getCalculationTypesGlobalSelectionState(mockState)
      ).toMatchSnapshot();
    });
  });

  describe('getCalculationTypesConfig', () => {
    it('should return the operation conditions', () => {
      expect(getCalculationTypesConfig(mockState)).toMatchSnapshot();
    });
  });
});
