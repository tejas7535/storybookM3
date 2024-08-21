import { CALCULATION_RESULT_MOCK_ID } from '@ga/testing/mocks';

import {
  addResultMessage,
  calculationError,
  calculationSuccess,
  getCalculation,
  setResultMessage,
} from './calculation-result.actions';

describe('Calculation Result Actions', () => {
  describe('Get Calculation Action', () => {
    it('getCalculation', () => {
      const action = getCalculation();

      expect(action).toEqual({
        type: '[Calculation Result] Get Calculation',
      });
    });

    it('calculationSuccess', () => {
      const resultId = CALCULATION_RESULT_MOCK_ID;
      const action = calculationSuccess({ resultId });

      expect(action).toEqual({
        resultId,
        type: '[Calculation Result] Get Calculation Success',
      });
    });

    it('calculationError', () => {
      const action = calculationError();

      expect(action).toEqual({
        type: '[Calculation Result] Get Calculation Error',
      });
    });

    it('setResultMessage', () => {
      const messages = [{ translationKey: 'test' }];
      const action = setResultMessage({ messages });

      expect(action).toEqual({
        type: '[Calculation Result] Set result message',
        messages,
      });
    });

    it('addResultMessage', () => {
      const message = { translationKey: 'test' };
      const action = addResultMessage({ message });

      expect(action).toEqual({
        type: '[Calculation Reuslt] Add result message',
        message,
      });
    });
  });
});
