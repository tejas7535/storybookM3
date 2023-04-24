import {
  APP_STATE_MOCK,
  CATALOG_CALCULATION_RESULT_STATE_MOCK,
} from '@ea/testing/mocks';

import {
  getBasicFrequencies,
  isCalculationResultAvailable,
  isLoading,
} from './catalog-calculation-result.selector';

describe('Catalog Calculation Result Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
  };

  describe('getBasicFrequencies', () => {
    it('should return the basic frequencies', () => {
      expect(
        getBasicFrequencies({
          ...mockState,
          catalogCalculationResult: {
            ...mockState.catalogCalculationResult,
            result: 'my-result',
          },
        })
      ).toEqual('my-result');
    });
  });

  describe('isCalculationResultAvailable', () => {
    it('should return true if we have a result', () => {
      expect(isCalculationResultAvailable(mockState)).toEqual(
        !!CATALOG_CALCULATION_RESULT_STATE_MOCK.result
      );
    });
  });

  describe('isLoading', () => {
    it('should return true if loading is in progress', () => {
      expect(
        isLoading({
          ...mockState,
          catalogCalculationResult: {
            ...mockState.catalogCalculationResult,
            isLoading: true,
          },
        })
      ).toEqual(true);
    });
  });
});
