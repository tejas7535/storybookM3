import { Transaction } from '../../reducers/transactions/models/transaction.model';
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
        type: '[Process Case] Load Comparable Transactions for QuotationDetail',
      });
    });
  });
  describe('loadComparableTransactionsSuccess', () => {
    test('loadComparableTransactionsSuccess', () => {
      const transactions: Transaction[] = [];
      action = loadComparableTransactionsSuccess({ transactions });
      expect(action).toEqual({
        transactions,
        type:
          '[Process Case] Load Comparable Transactions for QuotationDetail Success',
      });
    });
  });
  describe('loadComparableTransactionsFailure', () => {
    test('loadComparableTransactionsFailure', () => {
      action = loadComparableTransactionsFailure({ errorMessage });
      expect(action).toEqual({
        errorMessage,
        type:
          '[Process Case] Load Comparable Transactions for QuotationDetail Failure',
      });
    });
  });
});
