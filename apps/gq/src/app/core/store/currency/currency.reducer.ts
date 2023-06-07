import { createFeature, createReducer, on } from '@ngrx/store';

import { CurrencyActions } from './currency.actions';

export const CURRENCY_KEY = 'currencies';
export interface CurrencyState {
  availableCurrencies: string[];
  error: Error;
}

export const initialState: CurrencyState = {
  availableCurrencies: [],
  error: undefined,
};

export const currencyFeature = createFeature({
  name: CURRENCY_KEY,
  reducer: createReducer(
    initialState,
    on(
      CurrencyActions.loadAvailableCurrencies,
      (state: CurrencyState): CurrencyState => ({
        ...state,
        error: undefined,
        availableCurrencies: [],
      })
    ),
    on(
      CurrencyActions.loadAvailableCurrenciesSuccess,
      (state: CurrencyState, { currencies }): CurrencyState => ({
        ...state,
        availableCurrencies: currencies,
        error: undefined,
      })
    ),
    on(
      CurrencyActions.loadAvailableCurrenciesFailure,
      (state: CurrencyState, { error }): CurrencyState => ({
        ...state,
        error,
      })
    )
  ),
});
