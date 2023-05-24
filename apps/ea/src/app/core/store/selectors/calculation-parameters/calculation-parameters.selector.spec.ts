import { CALCULATION_PARAMETERS_STATE_MOCK } from '@ea/testing/mocks';

import {
  getEnergySource,
  getOperationConditions,
  isCalculationMissingInput,
} from './calculation-parameters.selector';
import { getCalculationTypes } from './calculation-types.selector';

describe('Calculation Result Selector', () => {
  const mockState = {
    calculationParameters: {
      ...CALCULATION_PARAMETERS_STATE_MOCK,
    },
  };

  describe('getOperationConditions', () => {
    it('should return the operation conditions', () => {
      expect(getOperationConditions(mockState)).toEqual(
        CALCULATION_PARAMETERS_STATE_MOCK.operationConditions
      );
    });
  });

  describe('getEnergySource', () => {
    it('should return the energy source', () => {
      expect(getEnergySource(mockState)).toEqual(
        CALCULATION_PARAMETERS_STATE_MOCK.energySource
      );
    });
  });

  describe('isCalculationMissingInput', () => {
    it('should return true if any of the calculation parameters are missing', () => {
      expect(
        isCalculationMissingInput({
          calculationParameters: {
            ...CALCULATION_PARAMETERS_STATE_MOCK,
            isInputInvalid: true,
          },
        })
      ).toEqual(true);

      expect(
        isCalculationMissingInput({
          calculationParameters: {
            ...CALCULATION_PARAMETERS_STATE_MOCK,
            isInputInvalid: false,
          },
        })
      ).toEqual(false);
    });
  });

  describe('getCalculationType', () => {
    it('should return the calculation type state', () => {
      expect(
        getCalculationTypes({
          calculationParameters: {
            ...CALCULATION_PARAMETERS_STATE_MOCK,
          },
        })
      ).toEqual(CALCULATION_PARAMETERS_STATE_MOCK.calculationTypes);
    });
  });
});
