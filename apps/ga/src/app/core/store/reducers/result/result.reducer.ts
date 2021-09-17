import { Action, createReducer, on } from '@ngrx/store';

import {
  calculationError,
  calculationSuccess,
  getCalculation,
} from '../../actions/result/result.actions';

export interface ResultState {
  resultId: string;
  jsonResult: string;
  htmlResult: string;
  loading: boolean;
}

export const initialState: ResultState = {
  resultId: undefined,
  jsonResult: undefined,
  htmlResult: undefined,
  loading: false,
};

export const resultReducer = createReducer(
  initialState,
  on(
    getCalculation,
    (state: ResultState): ResultState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    calculationSuccess,
    (state: ResultState, { resultId }): ResultState => ({
      ...state,
      resultId,
      loading: false,
    })
  ),
  on(
    calculationError,
    (state: ResultState): ResultState => ({
      ...state,
      loading: false,
    })
  )
);

export function reducer(state: ResultState, action: Action): ResultState {
  return resultReducer(state, action);
}
