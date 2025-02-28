import { Action } from '@ngrx/store';

import {
  addResultMessage,
  calculationError,
  calculationSuccess,
  getCalculation,
  setBearinxVersions,
  setResultMessage,
  unsetBearinxVersions,
} from '@ga/core/store/actions';
import { CALCULATION_RESULT_MOCK_ID } from '@ga/testing/mocks';

import { CalculationResultMessage } from '../../models';
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

  const resultMessages: CalculationResultMessage[] = [
    { translationKey: 'test' },
    { translationKey: 'test2' },
  ];

  describe('on setResultMessages', () => {
    it('should set the result messages', () => {
      const action: Action = setResultMessage({ messages: resultMessages });
      const state = calculationResultReducer(initialState, action);

      expect(state.messages).toBe(resultMessages);
    });
  });
  describe('on addResultMessage', () => {
    it('should update the messagearray', () => {
      const action: Action = addResultMessage({ message: resultMessages[0] });
      const state = calculationResultReducer(initialState, action);

      expect(state.messages).toEqual([resultMessages[0]]);
    });
  });

  describe('Bearinx Versions', () => {
    it('should set bearinx versions', () => {
      const newState = calculationResultReducer(
        initialState,
        setBearinxVersions({
          versions: { abc: '123' },
        })
      );

      expect(newState).toEqual({
        ...initialState,
        versions: { abc: '123' },
      });
    });

    it('should unset bearinx versions', () => {
      const newState = calculationResultReducer(
        {
          ...initialState,
          versions: { abc: '123' },
        },
        unsetBearinxVersions()
      );

      expect(newState).toEqual({
        ...initialState,
        versions: undefined,
      });
    });
  });
});
