import { Action } from '@ngrx/store';

import { CALCULATION_RESULT_MOCK_ID } from '@ga/testing/mocks';

import {
  calculationError,
  calculationSuccess,
  getCalculation,
} from '../../actions/result/result.actions';
import { initialState, reducer, resultReducer } from './result.reducer';

describe('Result Reducer', () => {
  describe('Reducer function', () => {
    it('should return resultReducer', () => {
      // prepare any action
      const action: Action = getCalculation();
      expect(reducer(initialState, action)).toEqual(
        resultReducer(initialState, action)
      );
    });
  });

  describe('on getCalculation', () => {
    it('should set loading', () => {
      const action: Action = getCalculation();
      const state = resultReducer(initialState, action);

      expect(state.loading).toBe(true);
    });
  });

  describe('on calculationSuccess', () => {
    it('should set resultId and loading', () => {
      const mockResultId = CALCULATION_RESULT_MOCK_ID;
      const action: Action = calculationSuccess({
        resultId: mockResultId,
      });
      const state = resultReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.resultId).toEqual(mockResultId);
    });
  });

  describe('on calculationError', () => {
    it('should set loading', () => {
      const action: Action = calculationError();
      const state = resultReducer(initialState, action);

      expect(state.loading).toBe(false);
    });
  });
});
