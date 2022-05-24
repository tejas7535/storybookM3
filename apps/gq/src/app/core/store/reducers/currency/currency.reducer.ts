import { Action, createReducer, on } from '@ngrx/store';

import {
  loadAvailableCurrenciesFailure,
  loadAvailableCurrenciesSuccess,
} from '../../actions';

export interface CurrencyState {
  availableCurrencies: string[];
  errorMessage?: string;
}

export const initialState: CurrencyState = {
  availableCurrencies: [],
};

export const currencyReducer = createReducer(
  initialState,
  on(
    loadAvailableCurrenciesSuccess,
    (state: CurrencyState, { currencies }): CurrencyState => ({
      ...state,
      availableCurrencies: currencies,
    })
  ),
  on(
    loadAvailableCurrenciesFailure,
    (state: CurrencyState, { errorMessage }): CurrencyState => ({
      ...state,
      errorMessage,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: CurrencyState, action: Action): CurrencyState {
  return currencyReducer(state, action);
}
