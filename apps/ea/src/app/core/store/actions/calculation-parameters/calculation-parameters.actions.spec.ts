import { CalculationParametersState } from '@ea/core/store/models';

import {
  operatingParameters,
  resetCalculationParams,
} from './calculation-parameters.actions';

describe('Calculation Parameters Actions', () => {
  describe('Patch Parameters', () => {
    it('operatingParameters', () => {
      const mockParameters = {} as CalculationParametersState;
      const action = operatingParameters({ parameters: mockParameters });

      expect(action).toEqual({
        parameters: mockParameters,
        type: '[Calculation Parameters] Operating Parameters',
      });
    });
  });
  describe('Reset CalculationParams', () => {
    it('resetCalculationParams', () => {
      const action = resetCalculationParams();

      expect(action).toEqual({
        type: '[Calculation Parameters] Reset Operating Parameters',
      });
    });
  });
});
