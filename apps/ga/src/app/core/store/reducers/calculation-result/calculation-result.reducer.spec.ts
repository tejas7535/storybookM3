import { Action } from '@ngrx/store';

import {
  calculationError,
  calculationSuccess,
  getCalculation,
} from '@ga/core/store/actions';
import { CALCULATION_RESULT_MOCK_ID } from '@ga/testing/mocks';

import {
  calculationResultReducer,
  initialState,
  reducer,
} from './calculation-result.reducer';

describe('calculationResultReducer', () => {
  describe('Reducer function', () => {
    it('should return calculationResultReducer', () => {
      // prepare any action
      const action: Action = getCalculation();
      expect(reducer(initialState, action)).toEqual(
        calculationResultReducer(initialState, action)
      );
    });
  });

  describe('on getCalculation', () => {
    it('should set loading', () => {
      const action: Action = getCalculation();
      const state = calculationResultReducer(initialState, action);

      expect(state.loading).toBe(true);
    });
  });

  describe('on calculationSuccess', () => {
    it('should set resultId and loading', () => {
      const mockResultId = CALCULATION_RESULT_MOCK_ID;
      const action: Action = calculationSuccess({
        resultId: mockResultId,
      });
      const state = calculationResultReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.resultId).toEqual(mockResultId);
    });
  });

  describe('on calculationError', () => {
    it('should set loading', () => {
      const action: Action = calculationError();
      const state = calculationResultReducer(initialState, action);

      expect(state.loading).toBe(false);
    });
  });
});
