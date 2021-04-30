import { TRANSACTIONS_STATE_MOCK } from '../../../../../testing/mocks';
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
});
