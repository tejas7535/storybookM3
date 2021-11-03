import {
  COMPARABLE_LINKED_TRANSACTION_MOCK,
  TRANSACTIONS_STATE_MOCK,
} from '../../../../../testing/mocks';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from '../../actions';
import { transactionsReducer } from './transactions.reducer';

describe('Transactions Reducer', () => {
  describe('loadComparableTransactions', () => {
    test('should set transactions', () => {
      const gqPositionId = '1234';
      const action = loadComparableTransactions({ gqPositionId });

      const state = transactionsReducer(TRANSACTIONS_STATE_MOCK, action);

      expect(state).toEqual({
        ...TRANSACTIONS_STATE_MOCK,
        gqPositionId,
        transactionsLoading: true,
      });
    });
  });
  describe('loadComparableTransactionsSuccess', () => {
    test('should set transactions', () => {
      const transactions = [COMPARABLE_LINKED_TRANSACTION_MOCK];
      const action = loadComparableTransactionsSuccess({ transactions });

      const state = transactionsReducer(TRANSACTIONS_STATE_MOCK, action);

      expect(state).toEqual({
        ...TRANSACTIONS_STATE_MOCK,
        transactions,
      });
    });
  });
  describe('loadComparableTransactionsFailure', () => {
    test('should set errorMessage', () => {
      const errorMessage = 'error';
      const action = loadComparableTransactionsFailure({ errorMessage });

      const state = transactionsReducer(TRANSACTIONS_STATE_MOCK, action);

      expect(state).toEqual({
        ...TRANSACTIONS_STATE_MOCK,
        errorMessage,
      });
    });
  });
});
