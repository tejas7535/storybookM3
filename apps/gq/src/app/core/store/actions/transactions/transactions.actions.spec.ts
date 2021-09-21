import { ComparableLinkedTransaction } from '../../reducers/transactions/models/comparable-linked-transaction.model';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
  TransactionsActions,
} from './transactions.actions';

describe('TransactionsActions', () => {
  let action: TransactionsActions;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;
    errorMessage = 'An error occured';
  });

  describe('loadComparableTransactions', () => {
    test('loadComparableTransactions', () => {
      const gqPositionId = '123';
      action = loadComparableTransactions({ gqPositionId });
      expect(action).toEqual({
        gqPositionId,
        type: '[Transactions] Load Comparable Transactions for QuotationDetail',
      });
    });
  });
  describe('loadComparableTransactionsSuccess', () => {
    test('loadComparableTransactionsSuccess', () => {
      const transactions: ComparableLinkedTransaction[] = [];
      action = loadComparableTransactionsSuccess({ transactions });
      expect(action).toEqual({
        transactions,
        type: '[Transactions] Load Comparable Transactions for QuotationDetail Success',
      });
    });
  });
  describe('loadComparableTransactionsFailure', () => {
    test('loadComparableTransactionsFailure', () => {
      action = loadComparableTransactionsFailure({ errorMessage });
      expect(action).toEqual({
        errorMessage,
        type: '[Transactions] Load Comparable Transactions for QuotationDetail Failure',
      });
    });
  });
});
