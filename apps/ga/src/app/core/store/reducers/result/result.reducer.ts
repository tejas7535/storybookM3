import { Action, createReducer } from '@ngrx/store';

export interface ResultState {
  resultId: string;
  jsonResult: string;
  htmlResult: string;
}

export const initialState: ResultState = {
  resultId: undefined,
  jsonResult: undefined,
  htmlResult: undefined,
};

export const resultReducer = createReducer(initialState);

export function reducer(state: ResultState, action: Action): ResultState {
  return resultReducer(state, action);
}
