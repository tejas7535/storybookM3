import { createAction, props, union } from '@ngrx/store';

import { ComparableLinkedTransactionResponse } from './models/comparable-linked-transaction-response.interface';

export const loadComparableTransactions = createAction(
  '[Transactions] Load Comparable Transactions for QuotationDetail',
  props<{ gqPositionId: string }>()
);

export const loadComparableTransactionsSuccess = createAction(
  '[Transactions] Load Comparable Transactions for QuotationDetail Success',
  props<{
    comparableLinkedTransactionResponse: ComparableLinkedTransactionResponse;
  }>()
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
