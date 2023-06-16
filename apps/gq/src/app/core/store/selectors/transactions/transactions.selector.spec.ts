import { TRANSACTIONS_STATE_MOCK } from '../../../../../testing/mocks';
import { TransactionsState } from '../../reducers/transactions/transactions.reducer';
import * as transactionsSelectors from './transactions.selector';

describe('Transactions Selector', () => {
  const fakeState = TRANSACTIONS_STATE_MOCK;

  describe('getTransactions', () => {
    test('should return transactions', () => {
      expect(
        transactionsSelectors.getTransactions.projector(fakeState)
      ).toEqual(fakeState.transactions);
    });
  });
  describe('getTransactionsLoading', () => {
    test('should return transactionsLoading', () => {
      expect(
        transactionsSelectors.getTransactionsLoading.projector(fakeState)
      ).toEqual(fakeState.transactionsLoading);
    });
  });
  describe('getGraphTransactions', () => {
    test('should return transactions for graph', () => {
      const transaction1 = { profitMargin: 10 };
      const transaction2 = { profitMargin: -10 };
      const state = {
        ...fakeState,
        transactions: [transaction1, transaction2],
      };
      expect(
        transactionsSelectors.getGraphTransactions.projector(
          state as unknown as TransactionsState
        )
      ).toEqual([transaction1]);
    });
  });
});
