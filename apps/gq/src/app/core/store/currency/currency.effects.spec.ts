import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CurrencyService } from '@gq/shared/services/rest/currency/currency.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { CurrencyActions } from './currency.actions';
import { CurrencyEffects } from './currency.effects';
import { initialState } from './currency.reducer';

describe('CurrencyEffects', () => {
  let actions$: any;
  let effects: CurrencyEffects;
  let spectator: SpectatorService<CurrencyEffects>;

  let currencyService: CurrencyService;

  const createService = createServiceFactory({
    service: CurrencyEffects,
    providers: [
      MockProvider(CurrencyService),
      provideMockActions(() => actions$),
      provideHttpClientTesting(),
      provideMockStore({ initialState: { currency: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CurrencyEffects);
    currencyService = spectator.inject(CurrencyService);
  });

  describe('loadCurrencies$', () => {
    test(
      'should dispatch success Action',
      marbles((m) => {
        currencyService.getCurrencies = jest.fn(() => response);
        const currencies = [{ currency: 'USD' }, { currency: 'EUR' }];

        actions$ = m.hot('-a', {
          a: CurrencyActions.loadAvailableCurrencies(),
        });

        const response = m.cold('-a|', { a: currencies });
        const expected = m.cold('--b', {
          b: CurrencyActions.loadAvailableCurrenciesSuccess({
            currencies: ['EUR', 'USD'],
          }),
        });

        m.expect(effects.loadCurrencies$).toBeObservable(expected);
        m.flush();
        expect(currencyService.getCurrencies).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should dispatch failure Action',
      marbles((m) => {
        const error = new Error('did not work');
        const response = m.cold('-#|', undefined, error);
        currencyService.getCurrencies = jest.fn(() => response);

        actions$ = m.hot('-a', {
          a: CurrencyActions.loadAvailableCurrencies(),
        });

        const expected = m.cold('--b', {
          b: CurrencyActions.loadAvailableCurrenciesFailure({
            error,
          }),
        });

        m.expect(effects.loadCurrencies$).toBeObservable(expected);
        m.flush();
        expect(currencyService.getCurrencies).toHaveBeenCalledTimes(1);
      })
    );
  });
});
