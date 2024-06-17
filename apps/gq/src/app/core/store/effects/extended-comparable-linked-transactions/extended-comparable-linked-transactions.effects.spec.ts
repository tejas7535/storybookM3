import { HttpClientTestingModule } from '@angular/common/http/testing';

import { getGqId } from '@gq/core/store/active-case/active-case.selectors';
import { QuotationDetailsService } from '@gq/shared/services/rest/quotation-details/quotation-details.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  loadExtendedComparableLinkedTransaction,
  loadExtendedComparableLinkedTransactionFailure,
  loadExtendedComparableLinkedTransactionSuccess,
} from '../../actions';
import { ExtendedComparableLinkedTransaction } from '../../reducers/models';
import { ExtendedComparableLinkedTransactionsEffect } from './extended-comparable-linked-transactions.effects';

describe('ExtendedComparableLinkedTransactionsEffect', () => {
  let spectator: SpectatorService<ExtendedComparableLinkedTransactionsEffect>;
  let effects: ExtendedComparableLinkedTransactionsEffect;
  let actions$: any;
  let action: any;
  let quotationDetailsService: QuotationDetailsService;
  let store: MockStore;

  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: ExtendedComparableLinkedTransactionsEffect,
    imports: [HttpClientTestingModule],
    providers: [provideMockActions(() => actions$), provideMockStore()],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ExtendedComparableLinkedTransactionsEffect);
    store = spectator.inject(MockStore);
    quotationDetailsService = spectator.inject(QuotationDetailsService);
  });

  describe('loadExtendedComparableLinkedTransactions$', () => {
    const quotationNumber = 5678;
    const extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[] =
      [];

    beforeEach(() => {
      store.overrideSelector(getGqId, quotationNumber);
      action = loadExtendedComparableLinkedTransaction();
    });

    test(
      'should return loadExtendedComparableLinkedTransactionsSuccess',
      marbles((m) => {
        action = loadExtendedComparableLinkedTransaction();

        const result = loadExtendedComparableLinkedTransactionSuccess({
          extendedComparableLinkedTransactions,
        });
        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: extendedComparableLinkedTransactions,
        });
        quotationDetailsService.getAllTransactions = jest.fn(() => response);
        const expected$ = m.cold('--b', { b: result });

        m.expect(
          effects.loadExtendedComparableLinkedTransactions$
        ).toBeObservable(expected$);

        m.flush();

        expect(quotationDetailsService.getAllTransactions).toHaveBeenCalledWith(
          quotationNumber
        );
      })
    );

    test(
      'should return loadExtendedComparableLinkedTransactionsFailure',
      marbles((m) => {
        action = loadExtendedComparableLinkedTransaction();
        const result = loadExtendedComparableLinkedTransactionFailure({
          errorMessage,
        });
        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });
        quotationDetailsService.getAllTransactions = jest.fn(() => response);

        m.expect(
          effects.loadExtendedComparableLinkedTransactions$
        ).toBeObservable(expected);
        m.flush();

        expect(quotationDetailsService.getAllTransactions).toHaveBeenCalled();
      })
    );
  });
});
