import { CurrencyActions } from './currency.actions';
import { currencyFeature, CurrencyState } from './currency.reducer';

describe('Currency reducer', () => {
  const initialState: CurrencyState = {
    availableCurrencies: [],
    error: undefined,
  };

  test('should reset the State', () => {
    const action = CurrencyActions.loadAvailableCurrencies();
    const state = currencyFeature.reducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  test('should set available currency', () => {
    const currencies = ['EUR', 'USD'];
    const action = CurrencyActions.loadAvailableCurrenciesSuccess({
      currencies,
    });

    const state = currencyFeature.reducer(initialState, action);
    expect(state.availableCurrencies).toEqual(['EUR', 'USD']);
  });

  test('should set error message on Failure', () => {
    const error = new Error('An error occured');
    const action = CurrencyActions.loadAvailableCurrenciesFailure({
      error,
    });

    const state = currencyFeature.reducer(initialState, action);
    expect(state.error).toEqual(error);
  });
});
