import { CalculationParametersState } from '@ea/core/store/models';
import { Action, createReducer, on } from '@ngrx/store';

import {
  operatingParameters,
  resetCalculationParams,
} from '../../actions/calculation-parameters/calculation-parameters.actions';

export const initialState: CalculationParametersState = {
  operationConditions: {
    rotation: undefined,
    axial: undefined,
    radial: undefined,
  },
};

export const calculationParametersReducer = createReducer(
  initialState,
  on(
    operatingParameters,
    (state, { parameters }): CalculationParametersState => ({
      ...state,
      ...parameters,
    })
  ),

  on(
    resetCalculationParams,
    (state): CalculationParametersState => ({
      ...state,
      operationConditions: {
        rotation: undefined,
        axial: undefined,
        radial: undefined,
      },
    })
  )
);

export function reducer(
  state: CalculationParametersState,
  action: Action
): CalculationParametersState {
  return calculationParametersReducer(state, action);
}
