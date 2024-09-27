import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ComparableLinkedTransaction } from '../transactions/models/comparable-linked-transaction.model';
import { transactionsFeature } from '../transactions/transactions.reducer';
import { TransactionsFacade } from './transactions.facade';
describe('TransactionsFacade', () => {
  let service: TransactionsFacade;
  let spectator: SpectatorService<TransactionsFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: TransactionsFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);

    jest.resetAllMocks();
  });

  describe('should provide Observables', () => {
    test(
      'should provide getTransactionsLoading$',
      marbles((m) => {
        mockStore.overrideSelector(
          transactionsFeature.selectTransactionsLoading,
          true
        );
        m.expect(service.transactionsLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide getTransactions$',
      marbles((m) => {
        mockStore.overrideSelector(
          transactionsFeature.selectTransactions,
          {} as ComparableLinkedTransaction[]
        );
        m.expect(service.transactions$).toBeObservable(
          m.cold('a', { a: {} as ComparableLinkedTransaction[] })
        );
      })
    );

    test(
      'should provide getGraphTransactions$',
      marbles((m) => {
        mockStore.overrideSelector(
          transactionsFeature.getGraphTransactions,
          {} as ComparableLinkedTransaction[]
        );
        m.expect(service.graphTransactions$).toBeObservable(
          m.cold('a', { a: {} as ComparableLinkedTransaction[] })
        );
      })
    );
  });
});
