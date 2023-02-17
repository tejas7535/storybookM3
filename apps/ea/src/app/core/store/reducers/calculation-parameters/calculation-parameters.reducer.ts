import { CalculationParametersState } from '@ea/core/store/models';
import { Action, createReducer } from '@ngrx/store';

export const initialState: CalculationParametersState = {};

export const calculationParametersReducer = createReducer(initialState);

export function reducer(
  state: CalculationParametersState,
  action: Action
): CalculationParametersState {
  return calculationParametersReducer(state, action);
}
