import { createAction, props, union } from '@ngrx/store';

import { ExtendedComparableLinkedTransaction } from '../../reducers/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';

export const loadExtendedComparableLinkedTransaction = createAction(
  '[Extended Transactions] Load Extended Comparable Linked Transactions for QuotationDetail',
  props<{ quotationNumber: number }>()
);

export const loadExtendedComparableLinkedTransactionSuccess = createAction(
  '[Extended Transactions] Load Extended Comparable Linked Transactions for QuotationDetail Success',
  props<{
    extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[];
  }>()
);

export const loadExtendedComparableLinkedTransactionFailure = createAction(
  '[Extended Transactions] Load Extended Comparable Linked Transactions for QuotationDetail Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadExtendedComparableLinkedTransaction,
  loadExtendedComparableLinkedTransactionSuccess,
  loadExtendedComparableLinkedTransactionFailure,
});

export type ExtendedComparableLinkedTransactionsActions = typeof all;
