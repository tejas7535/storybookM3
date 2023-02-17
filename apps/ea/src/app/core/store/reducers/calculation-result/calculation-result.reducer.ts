import { CalculationResultState } from '@ea/core/store/models';
import { Action, createReducer } from '@ngrx/store';

export const initialState: CalculationResultState = {};

export const calculationResultReducer = createReducer(initialState);

export function reducer(
  state: CalculationResultState,
  action: Action
): CalculationResultState {
  return calculationResultReducer(state, action);
}
