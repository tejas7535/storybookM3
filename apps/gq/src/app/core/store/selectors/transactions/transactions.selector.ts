import { createSelector } from '@ngrx/store';

import { getTransactionsState } from '../../reducers';
import { ComparableLinkedTransaction } from '../../reducers/transactions/models/comparable-linked-transaction.model';
import { TransactionsState } from '../../reducers/transactions/transactions.reducer';

export const getTransactions = createSelector(
  getTransactionsState,
  (state: TransactionsState): ComparableLinkedTransaction[] =>
    state.transactions
);

export const getTransactionsLoading = createSelector(
  getTransactionsState,
  (state: TransactionsState): boolean => state.transactionsLoading
);

export const getGraphTransactions = createSelector(
  getTransactionsState,
  (state: TransactionsState): ComparableLinkedTransaction[] =>
    state.transactions.filter(
      (transaction) =>
        transaction.profitMargin > 0 && transaction.profitMargin < 100
    )
);
