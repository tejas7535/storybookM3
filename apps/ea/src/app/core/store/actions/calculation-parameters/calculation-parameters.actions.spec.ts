import { CalculationParametersState } from '@ea/core/store/models';

import {
  operatingParameters,
  resetCalculationParameters,
} from './calculation-parameters.actions';

describe('Calculation Parameters Actions', () => {
  describe('Patch Parameters', () => {
    it('operatingParameters', () => {
      const mockParameters =
        {} as CalculationParametersState['operationConditions'];
      const action = operatingParameters({
        operationConditions: mockParameters,
      });

      expect(action).toEqual({
        operationConditions: mockParameters,
        type: '[Calculation Parameters] Operating Parameters',
      });
    });
  });
  describe('Reset CalculationParams', () => {
    it('resetCalculationParameters', () => {
      const action = resetCalculationParameters();

      expect(action).toEqual({
        type: '[Calculation Parameters] Reset Operating Parameters',
      });
    });
  });
});
