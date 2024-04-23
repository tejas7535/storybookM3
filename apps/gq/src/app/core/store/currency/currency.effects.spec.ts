import { HttpClientTestingModule } from '@angular/common/http/testing';

import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CurrencyActions } from './currency.actions';
import { CurrencyEffects } from './currency.effects';
import { initialState } from './currency.reducer';

describe('CurrencyEffects', () => {
  let actions$: any;
  let effects: CurrencyEffects;
  let spectator: SpectatorService<CurrencyEffects>;

  let quotationService: QuotationService;

  const createService = createServiceFactory({
    service: CurrencyEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { currency: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CurrencyEffects);
    quotationService = spectator.inject(QuotationService);
  });

  describe('loadCurrencies$', () => {
    test(
      'should dispatch success Action',
      marbles((m) => {
        quotationService.getCurrencies = jest.fn(() => response);
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
        expect(quotationService.getCurrencies).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should dispatch failure Action',
      marbles((m) => {
        const error = new Error('did not work');
        const response = m.cold('-#|', undefined, error);
        quotationService.getCurrencies = jest.fn(() => response);

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
        expect(quotationService.getCurrencies).toHaveBeenCalledTimes(1);
      })
    );
  });
});
