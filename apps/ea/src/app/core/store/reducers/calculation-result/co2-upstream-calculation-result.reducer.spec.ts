import { Action, createAction, props } from '@ngrx/store';

import { CO2UpstreamCalculationResultActions } from '../../actions';
import { CO2UpstreamCalculationResult } from '../../models';
import {
  co2UpstreamCalculationResultReducer,
  initialState,
  reducer,
} from './co2-upstream-calculation-result.reducer';

describe('co2UpstreamCalculationResultReducer', () => {
  describe('Reducer function', () => {
    it('should return co2UpstreamCalculationResultReducer', () => {
      // prepare any action
      const action: Action = createAction(
        '[Mock] Action',
        props<{ query: string }>()
      );

      expect(reducer(initialState, action)).toEqual(
        co2UpstreamCalculationResultReducer(initialState, action)
      );
    });
  });

  describe('Request Actions (enable loading)', () => {
    it.each([CO2UpstreamCalculationResultActions.fetchResult])(
      'should enable loading with action',
      (action) => {
        const newState = co2UpstreamCalculationResultReducer(
          initialState,
          action
        );

        expect(newState).toEqual({ ...initialState, isLoading: true });
      }
    );
  });

  describe('Calculation Failure', () => {
    it('should set calculation failure', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
      };

      const newState = co2UpstreamCalculationResultReducer(
        loadingState,
        CO2UpstreamCalculationResultActions.setCalculationFailure({
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

  describe('Calculation Result', () => {
    it('should set calculation result', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
        calculationError: 'some error',
      };

      const newState = co2UpstreamCalculationResultReducer(
        loadingState,
        CO2UpstreamCalculationResultActions.setCalculationResult({
          calculationResult: {
            abc: '123',
          } as unknown as CO2UpstreamCalculationResult,
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
