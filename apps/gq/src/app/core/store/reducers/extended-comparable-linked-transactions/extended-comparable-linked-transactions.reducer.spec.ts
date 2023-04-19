import {
  EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
  EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
} from '../../../../../testing/mocks';
import {
  loadExtendedComparableLinkedTransaction,
  loadExtendedComparableLinkedTransactionFailure,
  loadExtendedComparableLinkedTransactionSuccess,
} from '../../actions/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { extendedComparableLinkedTransactionsReducer } from './extended-comparable-linked-transactions.reducer';

describe('ExtendedComparableLinkedTransactions Reducer', () => {
  describe('loadExtendedComparableLinkedTransaction', () => {
    test('should set extendedComparableLinkedTransaction', () => {
      const action = loadExtendedComparableLinkedTransaction();

      const state = extendedComparableLinkedTransactionsReducer(
        EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        extendedComparableLinkedTransactionsLoading: true,
      });
    });
  });
  describe('loadExtendedComparableLinkedTransactionSuccess', () => {
    test('should set state', () => {
      const extendedComparableLinkedTransactions = [
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
      ];
      const action = loadExtendedComparableLinkedTransactionSuccess({
        extendedComparableLinkedTransactions,
      });

      const state = extendedComparableLinkedTransactionsReducer(
        EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        extendedComparableLinkedTransactions,
      });
    });
  });
  describe('loadExtendedComparableLinkedTransactionFailure', () => {
    test('should set state', () => {
      const errorMessage = 'error';
      const action = loadExtendedComparableLinkedTransactionFailure({
        errorMessage,
      });

      const state = extendedComparableLinkedTransactionsReducer(
        EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        errorMessage,
      });
    });
  });
});
