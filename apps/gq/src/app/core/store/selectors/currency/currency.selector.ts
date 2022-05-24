import { createSelector } from '@ngrx/store';

import { getCurrenciesState } from '../../reducers';
import { CurrencyState } from '../../reducers/currency/currency.reducer';

export const getAvailableCurrencies = createSelector(
  getCurrenciesState,
  (state: CurrencyState): string[] => state.availableCurrencies
);
