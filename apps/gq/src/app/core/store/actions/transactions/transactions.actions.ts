import { createAction, props, union } from '@ngrx/store';

import { ComparableLinkedTransaction } from '../../reducers/transactions/models/comparable-linked-transaction.model';

export const loadComparableTransactions = createAction(
  '[Transactions] Load Comparable Transactions for QuotationDetail',
  props<{ gqPositionId: string }>()
);

export const loadComparableTransactionsSuccess = createAction(
  '[Transactions] Load Comparable Transactions for QuotationDetail Success',
  props<{ transactions: ComparableLinkedTransaction[] }>()
);

export const loadComparableTransactionsFailure = createAction(
  '[Transactions] Load Comparable Transactions for QuotationDetail Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadComparableTransactions,
  loadComparableTransactionsSuccess,
  loadComparableTransactionsFailure,
});

export type TransactionsActions = typeof all;
