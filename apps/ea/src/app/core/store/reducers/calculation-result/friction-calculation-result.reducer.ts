import { FrictionCalculationResultState } from '@ea/core/store/models';
import { Action, createReducer, on } from '@ngrx/store';

import { FrictionCalculationResultActions } from '../../actions';

export const initialState: FrictionCalculationResultState = {
  isLoading: false,
  isCalculationImpossible: false,
};

export const frictionCalculationResultReducer = createReducer(
  initialState,
  on(
    FrictionCalculationResultActions.calculateModel,
    FrictionCalculationResultActions.createModel,
    FrictionCalculationResultActions.fetchCalculationResult,
    FrictionCalculationResultActions.updateModel,
    (state): FrictionCalculationResultState => ({
      ...state,
      isLoading: true,
    })
  ),

  on(
    FrictionCalculationResultActions.setLoading,
    (state, { isLoading }): FrictionCalculationResultState => ({
      ...state,
      isLoading,
    })
  ),

  on(
    FrictionCalculationResultActions.setCalculationImpossible,
    (state, { isCalculationImpossible }): FrictionCalculationResultState => ({
      ...state,
      isLoading: false,
      isCalculationImpossible,
    })
  ),

  on(
    FrictionCalculationResultActions.setCalculationId,
    (state, { calculationId }): FrictionCalculationResultState => ({
      ...state,
      calculationId,
      isLoading: false,
      calculationError: undefined,
    })
  ),
  on(
    FrictionCalculationResultActions.setModelId,
    (state, { modelId }): FrictionCalculationResultState => ({
      ...state,
      modelId,
      isLoading: false,
      calculationError: undefined,
    })
  ),
  on(
    FrictionCalculationResultActions.setCalculationResult,
    (state, { calculationResult }): FrictionCalculationResultState => ({
      ...state,
      calculationResult,
      isLoading: false,
      calculationError: undefined,
    })
  ),
  on(
    FrictionCalculationResultActions.setCalculationFailure,
    (state, { error }): FrictionCalculationResultState => ({
      ...state,
      isLoading: false,
      calculationError: error,
    })
  )
);

export function reducer(
  state: FrictionCalculationResultState,
  action: Action
): FrictionCalculationResultState {
  return frictionCalculationResultReducer(state, action);
}
