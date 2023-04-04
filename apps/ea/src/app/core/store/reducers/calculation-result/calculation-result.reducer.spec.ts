import { Action, createAction, props } from '@ngrx/store';

import { CalculationResultActions } from '../../actions';
import { CalculationResult } from '../../models';
import {
  calculationResultReducer,
  initialState,
  reducer,
} from './calculation-result.reducer';

describe('calculationResultReducer', () => {
  describe('Reducer function', () => {
    it('should return calculationResultReducer', () => {
      // prepare any action
      const action: Action = createAction(
        '[Mock] Action',
        props<{ query: string }>()
      );

      expect(reducer(initialState, action)).toEqual(
        calculationResultReducer(initialState, action)
      );
    });
  });

  describe('Request Actions (enable loading)', () => {
    it.each([
      CalculationResultActions.calculateModel,
      CalculationResultActions.createModel,
      CalculationResultActions.fetchCalculationResult,
      CalculationResultActions.updateModel,
    ])('should enable loading with action', (action) => {
      const newState = calculationResultReducer(initialState, action);

      expect(newState).toEqual({ ...initialState, isLoading: true });
    });
  });

  describe('Calculation Failure', () => {
    it('should set calculation failure', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const newState = calculationResultReducer(
        loadingState,
        CalculationResultActions.setCalculationFailure({ error: 'my-error' })
      );

      expect(newState).toEqual({
        ...loadingState,
        isLoading: false,
        calculationError: 'my-error',
      });
    });
  });

  describe('Calculation Impossible', () => {
    it('should set calculation impossible', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const newState = calculationResultReducer(
        loadingState,
        CalculationResultActions.setCalculationImpossible({
          isCalculationImpossible: true,
        })
      );

      expect(newState).toEqual({
        ...loadingState,
        isLoading: false,
        isCalculationImpossible: true,
      });
    });
  });

  describe('Calculation Id', () => {
    it('should set calculation id', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const newState = calculationResultReducer(
        loadingState,
        CalculationResultActions.setCalculationId({
          calculationId: '123',
        })
      );

      expect(newState).toEqual({
        ...loadingState,
        isLoading: false,
        calculationId: '123',
      });
    });
  });

  describe('Model Id', () => {
    it('should set model id', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const newState = calculationResultReducer(
        loadingState,
        CalculationResultActions.setModelId({
          modelId: '123',
        })
      );

      expect(newState).toEqual({
        ...loadingState,
        isLoading: false,
        modelId: '123',
      });
    });
  });

  describe('Calculation Result', () => {
    it('should set calculation result', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
        calculationError: 'some error',
      };

      const newState = calculationResultReducer(
        loadingState,
        CalculationResultActions.setCalculationResult({
          calculationResult: { abc: '123' } as unknown as CalculationResult,
        })
      );

      expect(newState).toEqual({
        ...loadingState,
        isLoading: false,
        calculationResult: { ...loadingState.calculationResult, abc: '123' },
        calculationError: undefined,
      });
    });
  });
});
