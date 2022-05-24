import {
  loadAvailableCurrenciesFailure,
  loadAvailableCurrenciesSuccess,
} from './currency.actions';

describe('Currency Actions', () => {
  test('Load available currencies', () => {
    const currencies = ['EUR', 'USD'];
    const action = loadAvailableCurrenciesSuccess({ currencies });

    expect(action).toEqual({
      currencies,
      type: '[Currency] Load available currencies Success',
    });
  });

  test('Load available currencies failure', () => {
    const errorMessage = 'Error';
    const action = loadAvailableCurrenciesFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Currency] Load available currencies failed',
    });
  });
});
