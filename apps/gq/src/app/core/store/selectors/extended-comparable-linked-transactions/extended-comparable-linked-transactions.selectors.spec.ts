import { EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK } from '../../../../../testing/mocks/state/extended-comparable-linked-transactions-state.mock';
import * as transactionsSelectors from './extended-comparable-linked-transactions.selector';

describe('ExtendedComparableLinkedTransaction Selector', () => {
  const fakeState = EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK;

  describe('get extendedComparableLinkedTransactions', () => {
    test('should return extendedComparableLinkedTransactions', () => {
      expect(
        transactionsSelectors.getExtendedComparableLinkedTransactions.projector(
          fakeState
        )
      ).toEqual(fakeState.extendedComparableLinkedTransactions);
    });
  });

  describe('get extendedComparableLinkedTransactions loading', () => {
    test('should return extendedComparableLinkedTransactionsLoading', () => {
      expect(
        transactionsSelectors.getExtendedComparableLinkedTransactionsLoading.projector(
          fakeState
        )
      ).toEqual(fakeState.extendedComparableLinkedTransactionsLoading);
    });
  });

  describe('getExtendedComparableLinkedTransactionsErrorMessage', () => {
    test('should return errorMessage', () => {
      expect(
        transactionsSelectors.getExtendedComparableLinkedTransactionsErrorMessage.projector(
          fakeState
        )
      ).toEqual(fakeState.errorMessage);
    });
  });
});
