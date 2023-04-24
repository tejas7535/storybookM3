import {
  APP_STATE_MOCK,
  CO2_UPSTREAM_CALCULATION_RESULT_STATE_MOCK,
} from '@ea/testing/mocks';

import {
  getCalculationResult,
  isCalculationResultAvailable,
  isLoading,
} from './co2-upstream-calculation-result.selector';

describe('CO2 Upstream Calculation Result Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
  };

  describe('getCalculationResult', () => {
    it('should return the result', () => {
      expect(
        getCalculationResult({
          ...mockState,
          co2UpstreamCalculationResult: {
            ...mockState.co2UpstreamCalculationResult,
            calculationResult: 'my-result',
          },
        })
      ).toEqual('my-result');
    });
  });

  describe('isCalculationResultAvailable', () => {
    it('should return true if we have a result', () => {
      expect(isCalculationResultAvailable(mockState)).toEqual(
        !!CO2_UPSTREAM_CALCULATION_RESULT_STATE_MOCK.calculationResult
      );
    });
  });

  describe('isLoading', () => {
    it('should return true if loading is in progress', () => {
      expect(
        isLoading({
          ...mockState,
          co2UpstreamCalculationResult: {
            ...mockState.co2UpstreamCalculationResult,
            isLoading: true,
          },
        })
      ).toEqual(true);
    });
  });
});
