import { TransactionsState } from '../../../app/core/store/transactions/transactions.reducer';

export const TRANSACTIONS_STATE_MOCK: TransactionsState = {
  gqPositionId: undefined,
  transactions: [],
  recommendationType: undefined,
  errorMessage: undefined,
  transactionsLoading: false,
};
