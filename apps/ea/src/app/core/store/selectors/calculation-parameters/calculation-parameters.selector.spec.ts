import {
  CALCULATION_PARAMETERS_MOCK,
  CALCULATION_PARAMETERS_STATE_MOCK,
} from '@ea/testing/mocks';

import {
  getCalculationParameters,
  isCalculationMissingInput,
} from './calculation-parameters.selector';

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

  describe('isCalculationMissingInput', () => {
    it('should return true if any of the calculation parameters are falsely', () => {
      expect(
        isCalculationMissingInput({
          calculationParameters: {
            ...CALCULATION_PARAMETERS_STATE_MOCK,
            operationConditions: {
              axial: 0,
              radial: 1,
              rotation: 1,
            },
          },
        })
      ).toEqual(true);

      expect(
        isCalculationMissingInput({
          calculationParameters: {
            ...CALCULATION_PARAMETERS_STATE_MOCK,
            operationConditions: {
              axial: 1,
              radial: 0,
              rotation: 1,
            },
          },
        })
      ).toEqual(true);

      expect(
        isCalculationMissingInput({
          calculationParameters: {
            ...CALCULATION_PARAMETERS_STATE_MOCK,
            operationConditions: {
              axial: 1,
              radial: 1,
              rotation: 0,
            },
          },
        })
      ).toEqual(true);

      expect(
        isCalculationMissingInput({
          calculationParameters: {
            ...CALCULATION_PARAMETERS_STATE_MOCK,
            operationConditions: {
              axial: 1,
              radial: 1,
              rotation: 1,
            },
          },
        })
      ).toEqual(false);
    });
  });
});
