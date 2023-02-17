import { CALCULATION_RESULT_STATE_MOCK } from '@ea/testing/mocks';

import { getCalculationResult } from './calculation-result.selector';

describe('Calculation Result Selector', () => {
  const mockState = {
    calculationResult: {
      ...CALCULATION_RESULT_STATE_MOCK,
    },
  };

  describe('getCalculationResult', () => {
    it('should return the calculation result state', () => {
      expect(getCalculationResult(mockState)).toEqual(
        CALCULATION_RESULT_STATE_MOCK
      );
    });
  });
});
