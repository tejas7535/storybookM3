import { CalculationResultState } from '@ea/core/store/models';
import { Action, createReducer } from '@ngrx/store';

export const initialState: CalculationResultState = {
  co2: { upstream: 0.72, downstream: 22.45 },
  ratingLife: 196.21,
  isResultAvailable: false,
  isCalculationImpossible: true,
};

export const calculationResultReducer = createReducer(initialState);

export function reducer(
  state: CalculationResultState,
  action: Action
): CalculationResultState {
  return calculationResultReducer(state, action);
}
