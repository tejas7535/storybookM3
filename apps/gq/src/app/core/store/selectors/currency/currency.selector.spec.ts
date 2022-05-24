import * as currencySelector from './currency.selector';

describe('Currency selector', () => {
  const fakeState = {
    currency: {
      availableCurrencies: ['EUR', 'USD'],
    },
  };

  test('getAvailableCurrencies', () => {
    expect(
      currencySelector.getAvailableCurrencies.projector(fakeState.currency)
    ).toEqual(fakeState.currency.availableCurrencies);
  });
});
