import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PriceService } from '../../../../shared/services/price-service/price.service';

import { ENV_CONFIG } from '@schaeffler/http';

import { cold, hot } from 'jasmine-marbles';
import { AppRoutePath } from '../../../../app-route-path.enum';
import { DetailRoutePath } from '../../../../detail-view/detail-route-path.enum';
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
    test('should return loadComparableTransactions', () => {
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

      actions$ = hot('-a', { a: action });

      const expected$ = cold('-b', { b: result });
      expect(effects.triggerLoadTransactions$).toBeObservable(expected$);
    });
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

    test('should return loadComparableTransactionsSuccess', () => {
      action = loadComparableTransactions({ gqPositionId });

      quotationDetailsService.getTransactions = jest.fn(() => response);

      const result = loadComparableTransactionsSuccess({ transactions });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: transactions });

      const expected$ = cold('--b', { b: result });

      expect(effects.loadTransactions$).toBeObservable(expected$);
      expect(
        PriceService.multiplyTransactionsWithPriceUnit
      ).toHaveBeenCalledTimes(1);
      expect(
        PriceService.multiplyTransactionsWithPriceUnit
      ).toHaveBeenCalledWith(transactions, 1);
      expect(quotationDetailsService.getTransactions).toHaveBeenCalledTimes(1);
      expect(quotationDetailsService.getTransactions).toHaveBeenCalledWith(
        gqPositionId
      );
    });
    test('should return loadComparableTransactionsFailure', () => {
      action = loadComparableTransactions({ gqPositionId });

      const result = loadComparableTransactionsFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });
      quotationDetailsService.getTransactions = jest.fn(() => response);

      expect(effects.loadTransactions$).toBeObservable(expected);
      expect(quotationDetailsService.getTransactions).toHaveBeenCalledTimes(1);
    });
  });
});
