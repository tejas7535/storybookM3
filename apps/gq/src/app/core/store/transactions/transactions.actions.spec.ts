import { ComparableLinkedTransactionResponse } from './models/comparable-linked-transaction-response.interface';
import { RecommendationType } from './models/recommendation-type.enum';
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
      const comparableLinkedTransactionResponse: ComparableLinkedTransactionResponse =
        {
          recommendationType: RecommendationType.MARGIN,
          comparableLinkedTransactions: [],
        };
      action = loadComparableTransactionsSuccess({
        comparableLinkedTransactionResponse,
      });
      expect(action).toEqual({
        comparableLinkedTransactionResponse,
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
