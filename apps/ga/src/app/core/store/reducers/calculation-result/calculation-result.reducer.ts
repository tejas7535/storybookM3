import { Action, createReducer, on } from '@ngrx/store';

import {
  addResultMessage,
  calculationError,
  calculationSuccess,
  getCalculation,
  setResultMessage,
} from '@ga/core/store/actions';
import { CalculationResultState } from '@ga/core/store/models';

export const initialState: CalculationResultState = {
  resultId: undefined,
  loading: false,
  messages: [],
};

export const calculationResultReducer = createReducer(
  initialState,
  on(
    getCalculation,
    (state): CalculationResultState => ({
      ...state,
      loading: true,
      messages: [],
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
  ),
  on(
    setResultMessage,
    (state, { messages }): CalculationResultState => ({
      ...state,
      messages,
    })
  ),
  on(
    addResultMessage,
    (state, { message }): CalculationResultState => ({
      ...state,
      messages: [message, ...state.messages],
    })
  )
);

export function reducer(
  state: CalculationResultState,
  action: Action
): CalculationResultState {
  return calculationResultReducer(state, action);
}
