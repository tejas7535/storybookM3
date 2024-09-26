import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DetailRoutePath } from '@gq/detail-view/detail-route-path.enum';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { COMPARABLE_LINKED_TRANSACTION_MOCK } from '../../../../testing/mocks';
import { AppRoutePath } from '../../../app-route-path.enum';
import { ComparableLinkedTransactionResponse } from './models/comparable-linked-transaction-response.interface';
import { RecommendationType } from './models/recommendation-type.enum';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from './transactions.actions';
import { TransactionsEffect } from './transactions.effects';

describe('TransactionsEffect', () => {
  let spectator: SpectatorService<TransactionsEffect>;
  let effects: TransactionsEffect;
  let actions$: any;
  let action: any;
  let quotationDetailsService: QuotationDetailsService;

  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: TransactionsEffect,
    imports: [HttpClientTestingModule],
    providers: [provideMockActions(() => actions$), provideMockStore()],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(TransactionsEffect);
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
    const comparableLinkedTransactionResponse: ComparableLinkedTransactionResponse =
      {
        recommendationType: RecommendationType.MARGIN,
        comparableLinkedTransactions: [COMPARABLE_LINKED_TRANSACTION_MOCK],
      };

    beforeEach(() => {
      (effects as any).executeTransactionComputations = jest.fn(
        () => comparableLinkedTransactionResponse.comparableLinkedTransactions
      );
      action = loadComparableTransactions({ gqPositionId });
    });

    test(
      'should return loadComparableTransactionsSuccess',
      marbles((m) => {
        action = loadComparableTransactions({ gqPositionId });
        const result = loadComparableTransactionsSuccess({
          comparableLinkedTransactionResponse,
        });
        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: comparableLinkedTransactionResponse,
        });
        quotationDetailsService.getTransactions = jest.fn(() => response);
        const expected$ = m.cold('--b', { b: result });

        m.expect(effects.loadTransactions$).toBeObservable(expected$);
        m.flush();

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
