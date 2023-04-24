import { Action, createAction, props } from '@ngrx/store';

import { FrictionCalculationResultActions } from '../../actions';
import { FrictionCalculationResult } from '../../models';
import {
  frictionCalculationResultReducer,
  initialState,
  reducer,
} from './friction-calculation-result.reducer';

describe('frictionCalculationResultReducer', () => {
  describe('Reducer function', () => {
    it('should return frictionCalculationResultReducer', () => {
      // prepare any action
      const action: Action = createAction(
        '[Mock] Action',
        props<{ query: string }>()
      );

      expect(reducer(initialState, action)).toEqual(
        frictionCalculationResultReducer(initialState, action)
      );
    });
  });

  describe('Request Actions (enable loading)', () => {
    it.each([
      FrictionCalculationResultActions.calculateModel,
      FrictionCalculationResultActions.createModel,
      FrictionCalculationResultActions.fetchCalculationResult,
      FrictionCalculationResultActions.updateModel,
    ])('should enable loading with action', (action) => {
      const newState = frictionCalculationResultReducer(initialState, action);

      expect(newState).toEqual({ ...initialState, isLoading: true });
    });
  });

  describe('Calculation Failure', () => {
    it('should set calculation failure', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const newState = frictionCalculationResultReducer(
        loadingState,
        FrictionCalculationResultActions.setCalculationFailure({
          error: 'my-error',
        })
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

      const newState = frictionCalculationResultReducer(
        loadingState,
        FrictionCalculationResultActions.setCalculationImpossible({
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

      const newState = frictionCalculationResultReducer(
        loadingState,
        FrictionCalculationResultActions.setCalculationId({
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

      const newState = frictionCalculationResultReducer(
        loadingState,
        FrictionCalculationResultActions.setModelId({
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

      const newState = frictionCalculationResultReducer(
        loadingState,
        FrictionCalculationResultActions.setCalculationResult({
          calculationResult: {
            abc: '123',
          } as unknown as FrictionCalculationResult,
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
