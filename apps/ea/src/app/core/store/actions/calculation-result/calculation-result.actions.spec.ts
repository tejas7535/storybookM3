import { CalculationResultState } from '../../models/calculation-result-state.model';
import { getCalculationResult } from './calculation-result.actions';

describe('Calculation Result Actions', () => {
  describe('Set Result', () => {
    it('calculationResult', () => {
      const mockResult = {} as CalculationResultState;
      const action = getCalculationResult({ result: mockResult });

      expect(action).toEqual({
        result: mockResult,
        type: '[Calculation Result] Get Calculation Result',
      });
    });
  });
});
