import { createSelector } from '@ngrx/store';

import { getExtendedComparableLinkedTransactionsState } from '../../reducers';
import { ExtendedComparableLinkedTransactionsState } from '../../reducers/extended-comparable-linked-transactions/extended-comparable-linked-transactions.reducer';
import { ExtendedComparableLinkedTransaction } from '../../reducers/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';

export const getExtendedComparableLinkedTransactions = createSelector(
  getExtendedComparableLinkedTransactionsState,
  (
    state: ExtendedComparableLinkedTransactionsState
  ): ExtendedComparableLinkedTransaction[] =>
    state.extendedComparableLinkedTransactions
);

export const getExtendedComparableLinkedTransactionsLoading = createSelector(
  getExtendedComparableLinkedTransactionsState,
  (state: ExtendedComparableLinkedTransactionsState): boolean =>
    state.extendedComparableLinkedTransactionsLoading
);

export const getExtendedComparableLinkedTransactionsErrorMessage =
  createSelector(
    getExtendedComparableLinkedTransactionsState,
    (state: ExtendedComparableLinkedTransactionsState): string =>
      state.errorMessage
  );
