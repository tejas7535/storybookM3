import { extendedComparableLinkedTransactionsReducer } from './extended-comparable-linked-transactions.reducer';
import { EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK } from '../../../../../testing/mocks/extended-comparable-linked-transactions-state.mock';
import {
  loadExtendedComparableLinkedTransaction,
  loadExtendedComparableLinkedTransactionFailure,
  loadExtendedComparableLinkedTransactionSuccess,
} from '../../actions/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK } from '../../../../../testing/mocks/extended-comparable-linked-transaction.mock';

describe('ExtendedComparableLinkedTransactions Reducer', () => {
  describe('loadExtendedComparableLinkedTransaction', () => {
    test('should set extendedComparableLinkedTransaction', () => {
      const quotationNumber = 1234;
      const action = loadExtendedComparableLinkedTransaction({
        quotationNumber,
      });

      const state = extendedComparableLinkedTransactionsReducer(
        EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        quotationNumber,
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
