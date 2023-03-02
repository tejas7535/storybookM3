import {
  loadAvailableCurrenciesFailure,
  loadAvailableCurrenciesSuccess,
} from '../../actions';
import { currencyReducer, CurrencyState } from './currency.reducer';

describe('Currency reducer', () => {
  const initialState: CurrencyState = {
    availableCurrencies: [],
  };

  test('should set available currency', () => {
    const currencies = ['EUR', 'USD'];
    const action = loadAvailableCurrenciesSuccess({
      currencies,
    });

    const state = currencyReducer(initialState, action);
    expect(state.availableCurrencies).toEqual(['EUR', 'USD']);
  });

  test('should set error message on Failure', () => {
    const errorMessage = 'An error occured';
    const action = loadAvailableCurrenciesFailure({
      errorMessage,
    });

    const state = currencyReducer(initialState, action);
    expect(state.errorMessage).toEqual(errorMessage);
  });
});
