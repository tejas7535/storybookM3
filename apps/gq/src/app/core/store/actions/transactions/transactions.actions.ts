import { createAction, props, union } from '@ngrx/store';

import { Transaction } from '../../../../core/store/reducers/transactions/models/transaction.model';

export const loadComparableTransactions = createAction(
  '[Process Case] Load Comparable Transactions for QuotationDetail',
  props<{ gqPositionId: string }>()
);

export const loadComparableTransactionsSuccess = createAction(
  '[Process Case] Load Comparable Transactions for QuotationDetail Success',
  props<{ transactions: Transaction[] }>()
);

export const loadComparableTransactionsFailure = createAction(
  '[Process Case] Load Comparable Transactions for QuotationDetail Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadComparableTransactions,
  loadComparableTransactionsSuccess,
  loadComparableTransactionsFailure,
});

export type TransactionsActions = typeof all;
