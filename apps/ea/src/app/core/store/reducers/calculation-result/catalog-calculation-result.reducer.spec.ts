import { Action, createAction, props } from '@ngrx/store';

import { CatalogCalculationResultActions } from '../../actions';
import { BasicFrequenciesResult } from '../../models';
import {
  catalogCalculationResultReducer,
  initialState,
  reducer,
} from './catalog-calculation-result.reducer';

describe('catalogCalculationResultReducer', () => {
  describe('Reducer function', () => {
    it('should return catalogCalculationResultReducer', () => {
      // prepare any action
      const action: Action = createAction(
        '[Mock] Action',
        props<{ query: string }>()
      );

      expect(reducer(initialState, action)).toEqual(
        catalogCalculationResultReducer(initialState, action)
      );
    });
  });

  describe('Request Actions (enable loading)', () => {
    it.each([CatalogCalculationResultActions.fetchBasicFrequencies])(
      'should enable loading with action',
      (action) => {
        const newState = catalogCalculationResultReducer(initialState, action);

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

      const newState = catalogCalculationResultReducer(
        loadingState,
        CatalogCalculationResultActions.setCalculationFailure({
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

      const newState = catalogCalculationResultReducer(
        loadingState,
        CatalogCalculationResultActions.setBasicFrequenciesResult({
          basicFrequenciesResult: {
            abc: '123',
          } as unknown as BasicFrequenciesResult,
        })
      );

      expect(newState).toEqual({
        ...loadingState,
        isLoading: false,
        result: { abc: '123' },
        calculationError: undefined,
      });
    });
  });
});
