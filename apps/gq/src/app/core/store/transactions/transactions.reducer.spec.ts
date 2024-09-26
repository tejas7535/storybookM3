import {
  COMPARABLE_LINKED_TRANSACTION_MOCK,
  TRANSACTIONS_STATE_MOCK,
} from '../../../../testing/mocks';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from '../actions';
import { ComparableLinkedTransaction } from './models';
import { ComparableLinkedTransactionResponse } from './models/comparable-linked-transaction-response.interface';
import { RecommendationType } from './models/recommendation-type.enum';
import { transactionsFeature } from './transactions.reducer';

describe('Transactions Reducer', () => {
  describe('Reducers', () => {
    describe('loadComparableTransactions', () => {
      test('should set transactions', () => {
        const gqPositionId = '1234';
        const action = loadComparableTransactions({ gqPositionId });

        const state = transactionsFeature.reducer(
          TRANSACTIONS_STATE_MOCK,
          action
        );

        expect(state).toEqual({
          ...TRANSACTIONS_STATE_MOCK,
          gqPositionId,
          transactionsLoading: true,
        });
      });
    });
    describe('loadComparableTransactionsSuccess', () => {
      test('should set transactions', () => {
        const comparableLinkedTransactionResponse: ComparableLinkedTransactionResponse =
          {
            recommendationType: RecommendationType.MARGIN,
            comparableLinkedTransactions: [COMPARABLE_LINKED_TRANSACTION_MOCK],
          };
        const action = loadComparableTransactionsSuccess({
          comparableLinkedTransactionResponse,
        });

        const state = transactionsFeature.reducer(
          TRANSACTIONS_STATE_MOCK,
          action
        );

        expect(state).toEqual({
          ...TRANSACTIONS_STATE_MOCK,
          transactions:
            comparableLinkedTransactionResponse.comparableLinkedTransactions,
          recommendationType:
            comparableLinkedTransactionResponse.recommendationType,
        });
      });
    });
    describe('loadComparableTransactionsFailure', () => {
      test('should set errorMessage', () => {
        const errorMessage = 'error';
        const action = loadComparableTransactionsFailure({ errorMessage });

        const state = transactionsFeature.reducer(
          TRANSACTIONS_STATE_MOCK,
          action
        );

        expect(state).toEqual({
          ...TRANSACTIONS_STATE_MOCK,
          errorMessage,
        });
      });
    });
  });
  describe('Extra Selectors', () => {
    test('should return graphTransactions', () => {
      const transaction1 = { profitMargin: 10 };
      const transaction2 = { profitMargin: -10 };

      const transactions = [
        transaction1,
        transaction2,
      ] as ComparableLinkedTransaction[];
      const state = {
        transactions: { ...TRANSACTIONS_STATE_MOCK, transactions },
      };

      expect(transactionsFeature.getGraphTransactions(state)).toEqual([
        transaction1,
      ]);
    });
  });
});
