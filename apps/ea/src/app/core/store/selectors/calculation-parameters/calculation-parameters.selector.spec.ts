import {
  CALCULATION_PARAMETERS_MOCK,
  CALCULATION_PARAMETERS_STATE_MOCK,
} from '@ea/testing/mocks';

import { getCalculationParameters } from './calculation-parameters.selector';

describe('Calculation Result Selector', () => {
  const mockState = {
    calculationParameters: {
      ...CALCULATION_PARAMETERS_STATE_MOCK,
    },
  };

  describe('getCalculationResult', () => {
    it('should return the calculation parameters state', () => {
      expect(getCalculationParameters(mockState)).toEqual(
        CALCULATION_PARAMETERS_MOCK
      );
    });
  });
});
