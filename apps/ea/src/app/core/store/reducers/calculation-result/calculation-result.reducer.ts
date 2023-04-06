import { CalculationResultState } from '@ea/core/store/models';
import { Action, createReducer, on } from '@ngrx/store';

import { CalculationResultActions } from '../../actions';

export const initialState: CalculationResultState = {
  calculationResult: {
    co2_upstream: 0.72,
    co2_downstream: 22.45,
    ratingLife: 196.21,
  },
  isLoading: false,
  isCalculationImpossible: false,
};

export const calculationResultReducer = createReducer(
  initialState,
  on(
    CalculationResultActions.calculateModel,
    CalculationResultActions.createModel,
    CalculationResultActions.fetchCalculationResult,
    CalculationResultActions.updateModel,
    (state): CalculationResultState => ({
      ...state,
      isLoading: true,
    })
  ),

  on(
    CalculationResultActions.setCalculationFailure,
    (state, { error }): CalculationResultState => ({
      ...state,
      calculationError: error,
      isLoading: false,
    })
  ),
  on(
    CalculationResultActions.setCalculationImpossible,
    (state, { isCalculationImpossible }): CalculationResultState => ({
      ...state,
      isCalculationImpossible,
      isLoading: false,
      calculationError: undefined,
    })
  ),
  on(
    CalculationResultActions.setCalculationId,
    (state, { calculationId }): CalculationResultState => ({
      ...state,
      calculationId,
      isLoading: false,
      isCalculationImpossible: false,
      calculationError: undefined,
    })
  ),
  on(
    CalculationResultActions.setModelId,
    (state, { modelId }): CalculationResultState => ({
      ...state,
      modelId,
      isLoading: false,
      isCalculationImpossible: false,
      calculationError: undefined,
    })
  ),
  on(
    CalculationResultActions.setCalculationResult,
    (state, { calculationResult }): CalculationResultState => ({
      ...state,
      calculationResult: {
        ...state.calculationResult, // TODO: Remove once more results are parsed,
        ...calculationResult,
      },
      isLoading: false,
      calculationError: undefined,
      isCalculationImpossible: false,
    })
  ),
  on(
    CalculationResultActions.setLoading,
    (state, { isLoading }): CalculationResultState => ({
      ...state,
      isLoading,
    })
  )
);

export function reducer(
  state: CalculationResultState,
  action: Action
): CalculationResultState {
  return calculationResultReducer(state, action);
}
