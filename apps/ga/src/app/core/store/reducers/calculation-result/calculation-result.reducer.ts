import { Action, createReducer, on } from '@ngrx/store';

import {
  calculationError,
  calculationSuccess,
  getCalculation,
} from '@ga/core/store/actions';
import { CalculationResultState } from '@ga/core/store/models';

export const initialState: CalculationResultState = {
  resultId: undefined,
  loading: false,
};

export const calculationResultReducer = createReducer(
  initialState,
  on(
    getCalculation,
    (state): CalculationResultState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    calculationSuccess,
    (state, { resultId }): CalculationResultState => ({
      ...state,
      resultId,
      loading: false,
    })
  ),
  on(
    calculationError,
    (state): CalculationResultState => ({
      ...state,
      loading: false,
    })
  )
);

export function reducer(
  state: CalculationResultState,
  action: Action
): CalculationResultState {
  return calculationResultReducer(state, action);
}
