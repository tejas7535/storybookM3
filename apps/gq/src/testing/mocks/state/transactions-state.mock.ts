import { TransactionsState } from '../../../app/core/store/reducers/transactions/transactions.reducer';

export const TRANSACTIONS_STATE_MOCK: TransactionsState = {
  gqPositionId: undefined,
  transactions: [],
  errorMessage: undefined,
  transactionsLoading: false,
};
