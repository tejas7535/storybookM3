import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CurrencyActions } from './currency.actions';
import { CurrencyFacade } from './currency.facade';
import { currencyFeature } from './currency.reducer';

describe('CurrencyFacade', () => {
  let service: CurrencyFacade;
  let spectator: SpectatorService<CurrencyFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: CurrencyFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test(
    'should provide allAvailableCurrencies',
    marbles((m) => {
      mockStore.overrideSelector(currencyFeature.selectAvailableCurrencies, [
        'EUR',
        'USD',
      ]);
      m.expect(service.availableCurrencies$).toBeObservable(
        m.cold('a', { a: ['EUR', 'USD'] })
      );
    })
  );

  test('should dispatch action', () => {
    mockStore.dispatch = jest.fn();

    service.loadCurrencies();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      CurrencyActions.loadAvailableCurrencies()
    );
  });
});
