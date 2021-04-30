import { createSelector } from '@ngrx/store';

import { Transaction } from '../../../../core/store/reducers/transactions/models/transaction.model';
import { getTransactionsState } from '../../reducers';
import { TransactionsState } from '../../reducers/transactions/transactions.reducer';

export const getTransactions = createSelector(
  getTransactionsState,
  (state: TransactionsState): Transaction[] => state.transactions
);

export const getTransactionsLoading = createSelector(
  getTransactionsState,
  (state: TransactionsState): boolean => state.transactionsLoading
);
