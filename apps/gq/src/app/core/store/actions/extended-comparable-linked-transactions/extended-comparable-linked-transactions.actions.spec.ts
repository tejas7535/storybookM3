import { ExtendedComparableLinkedTransaction } from '../../reducers/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';
import {
  ExtendedComparableLinkedTransactionsActions,
  loadExtendedComparableLinkedTransaction,
  loadExtendedComparableLinkedTransactionFailure,
  loadExtendedComparableLinkedTransactionSuccess,
} from './extended-comparable-linked-transactions.actions';

describe('ExtendedComparableLinkedTransactionsActions', () => {
  let action: ExtendedComparableLinkedTransactionsActions;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;
    errorMessage = 'An error occured';
  });

  describe('loadComparableTransactions', () => {
    test('loadComparableTransactions', () => {
      action = loadExtendedComparableLinkedTransaction();
      expect(action).toEqual({
        type: '[Extended Transactions] Load Extended Comparable Linked Transactions for Selected QuotationDetail',
      });
    });
  });
  describe('loadComparableTransactionsSuccess', () => {
    test('loadComparableTransactionsSuccess', () => {
      const extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[] =
        [];
      action = loadExtendedComparableLinkedTransactionSuccess({
        extendedComparableLinkedTransactions,
      });
      expect(action).toEqual({
        extendedComparableLinkedTransactions,
        type: '[Extended Transactions] Load Extended Comparable Linked Transactions for QuotationDetail Success',
      });
    });
  });
  describe('loadComparableTransactionsFailure', () => {
    test('loadComparableTransactionsFailure', () => {
      action = loadExtendedComparableLinkedTransactionFailure({ errorMessage });
      expect(action).toEqual({
        errorMessage,
        type: '[Extended Transactions] Load Extended Comparable Linked Transactions for QuotationDetail Failure',
      });
    });
  });
});
