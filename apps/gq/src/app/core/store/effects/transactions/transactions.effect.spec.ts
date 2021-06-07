import { HttpClientTestingModule } from '@angular/common/http/testing';

import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ENV_CONFIG } from '@schaeffler/http';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailRoutePath } from '../../../../detail-view/detail-route-path.enum';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { QuotationDetailsService } from '../../../../shared/services/rest-services/quotation-details-service/quotation-details.service';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from '../../actions';
import { Transaction } from '../../reducers/transactions/models/transaction.model';
import { getPriceUnitOfSelectedQuotationDetail } from '../../selectors';
import { TransactionsEffect } from './transactions.effect';

describe('TransactionsEffect', () => {
  let spectator: SpectatorService<TransactionsEffect>;
  let effects: TransactionsEffect;
  let actions$: any;
  let action: any;
  let quotationDetailsService: QuotationDetailsService;
  let store: MockStore;

  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: TransactionsEffect,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
          },
        },
      },
    ],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(TransactionsEffect);
    store = spectator.inject(MockStore);
    quotationDetailsService = spectator.inject(QuotationDetailsService);
  });

  describe('triggerLoadTransactions$', () => {
    test(
      'should return loadComparableTransactions',
      marbles((m) => {
        const queryParams = {
          gqPositionId: '5678',
        };
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              queryParams,
              url: `/${AppRoutePath.DetailViewPath}/${DetailRoutePath.TransactionsPath}`,
            },
          },
        };
        const gqPositionId = queryParams.gqPositionId;
        const result = loadComparableTransactions({ gqPositionId });

        actions$ = m.hot('-a', { a: action });

        const expected$ = m.cold('-b', { b: result });
        m.expect(effects.triggerLoadTransactions$).toBeObservable(expected$);
      })
    );
  });

  describe('transactions$', () => {
    const gqPositionId = '5678';
    const transactions: Transaction[] = [];

    beforeEach(() => {
      PriceService.multiplyTransactionsWithPriceUnit = jest.fn(
        () => transactions
      );
      store.overrideSelector(getPriceUnitOfSelectedQuotationDetail, 1);
      action = loadComparableTransactions({ gqPositionId });
    });

    test(
      'should return loadComparableTransactionsSuccess',
      marbles((m) => {
        action = loadComparableTransactions({ gqPositionId });

        const result = loadComparableTransactionsSuccess({ transactions });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: transactions });
        quotationDetailsService.getTransactions = jest.fn(() => response);

        const expected$ = m.cold('--b', { b: result });

        m.expect(effects.loadTransactions$).toBeObservable(expected$);

        m.flush();

        expect(
          PriceService.multiplyTransactionsWithPriceUnit
        ).toHaveBeenCalledTimes(1);
        expect(
          PriceService.multiplyTransactionsWithPriceUnit
        ).toHaveBeenCalledWith(transactions, 1);
        expect(quotationDetailsService.getTransactions).toHaveBeenCalledTimes(
          1
        );
        expect(quotationDetailsService.getTransactions).toHaveBeenCalledWith(
          gqPositionId
        );
      })
    );

    test(
      'should return loadComparableTransactionsFailure',
      marbles((m) => {
        action = loadComparableTransactions({ gqPositionId });

        const result = loadComparableTransactionsFailure({ errorMessage });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });
        quotationDetailsService.getTransactions = jest.fn(() => response);

        m.expect(effects.loadTransactions$).toBeObservable(expected);
        m.flush();

        expect(quotationDetailsService.getTransactions).toHaveBeenCalledTimes(
          1
        );
      })
    );
  });
});
