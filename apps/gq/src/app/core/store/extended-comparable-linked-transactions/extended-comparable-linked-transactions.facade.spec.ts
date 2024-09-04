import { ExtendedComparableLinkedTransactionsActions } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { ExtendedComparableLinkedTransactionsFacade } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.facade';
import { extendedComparableLinkedTransactionsFeature } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.reducer';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

describe('ExtendedComparableLinkedTransactionsFacade', () => {
  let service: ExtendedComparableLinkedTransactionsFacade;
  let spectator: SpectatorService<ExtendedComparableLinkedTransactionsFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: ExtendedComparableLinkedTransactionsFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
    mockStore.dispatch = jest.fn();
  });

  describe('loadExtendedComparableLinkedTransactionsForSelectedQuotationDetail', () => {
    test('should dispatch action', () => {
      service.loadExtendedComparableLinkedTransactionsForSelectedQuotationDetail();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForSelectedQuotationDetail()
      );
    });
  });

  describe('should provide Observables', () => {
    test(
      'should provide isErrorMessage$',
      marbles((m) => {
        mockStore.overrideSelector(
          extendedComparableLinkedTransactionsFeature.selectErrorMessage,
          'Error'
        );
        m.expect(service.isErrorMessage$).toBeObservable(
          m.cold('a', { a: 'Error' })
        );
      })
    );
    test(
      'should provide transactionsLoading$',
      marbles((m) => {
        mockStore.overrideSelector(
          extendedComparableLinkedTransactionsFeature.selectExtendedComparableLinkedTransactionsLoading,
          true
        );
        m.expect(service.transactionsLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
});
