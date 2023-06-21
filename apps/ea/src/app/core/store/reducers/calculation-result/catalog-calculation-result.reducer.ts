import { CatalogCalculationResultState } from '@ea/core/store/models';
import { Action, createReducer, on } from '@ngrx/store';

import { CatalogCalculationResultActions } from '../../actions';

export const initialState: CatalogCalculationResultState = {
  isLoading: false,
};

export const catalogCalculationResultReducer = createReducer(
  initialState,
  on(
    CatalogCalculationResultActions.fetchBasicFrequencies,
    (state): CatalogCalculationResultState => ({
      ...state,
      isLoading: true,
    })
  ),

  on(
    CatalogCalculationResultActions.setBasicFrequenciesResult,
    (state, { basicFrequenciesResult }): CatalogCalculationResultState => ({
      ...state,
      isLoading: false,
      calculationError: undefined,
      basicFrequencies: basicFrequenciesResult,
    })
  ),

  on(
    CatalogCalculationResultActions.fetchCalculationResult,
    (state): CatalogCalculationResultState => ({
      ...state,
      isLoading: true,
    })
  ),

  on(
    CatalogCalculationResultActions.setCalculationResult,
    (state, { calculationResult }): CatalogCalculationResultState => ({
      ...state,
      isLoading: false,
      calculationError: undefined,
      result: calculationResult,
    })
  ),

  on(
    CatalogCalculationResultActions.setCalculationFailure,
    (state, { error }): CatalogCalculationResultState => ({
      ...state,
      isLoading: false,
      calculationError: error,
    })
  )
);

export function reducer(
  state: CatalogCalculationResultState,
  action: Action
): CatalogCalculationResultState {
  return catalogCalculationResultReducer(state, action);
}
