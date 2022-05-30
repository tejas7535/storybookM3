import { CALCULATION_RESULT_MOCK_ID } from '@ga/testing/mocks';

import {
  calculationError,
  calculationSuccess,
  getCalculation,
} from './result.actions';

describe('Result Actions', () => {
  describe('Get Calculation Action', () => {
    it('getCalculation', () => {
      const action = getCalculation();

      expect(action).toEqual({
        type: '[Result] Get Calculation',
      });
    });

    it('calculationSuccess', () => {
      const resultId = CALCULATION_RESULT_MOCK_ID;
      const action = calculationSuccess({ resultId });

      expect(action).toEqual({
        resultId,
        type: '[Result] Get Calculation Success',
      });
    });

    it('calculationError', () => {
      const action = calculationError();

      expect(action).toEqual({
        type: '[Result] Get Calculation Error',
      });
    });
  });
});
