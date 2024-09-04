import { ExtendedComparableLinkedTransactionsActions } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { createFeature, createReducer, on } from '@ngrx/store';

import { ExtendedComparableLinkedTransaction } from './models/extended-comparable-linked-transaction';

export interface ExtendedComparableLinkedTransactionsState {
  extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[];
  errorMessage: string;
  extendedComparableLinkedTransactionsLoading: boolean;
}

export const initialState: ExtendedComparableLinkedTransactionsState = {
  extendedComparableLinkedTransactions: [],
  errorMessage: undefined,
  extendedComparableLinkedTransactionsLoading: false,
};

export const EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_KEY =
  'extendedComparableLinkedTransactions';

export const extendedComparableLinkedTransactionsFeature = createFeature({
  name: EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_KEY,
  reducer: createReducer(
    initialState,
    on(
      ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForSelectedQuotationDetail,
      (
        state: ExtendedComparableLinkedTransactionsState
      ): ExtendedComparableLinkedTransactionsState => ({
        ...state,
        extendedComparableLinkedTransactionsLoading: true,
      })
    ),
    on(
      ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForQuotationDetailSuccess,
      (
        state: ExtendedComparableLinkedTransactionsState,
        { extendedComparableLinkedTransactions }
      ): ExtendedComparableLinkedTransactionsState => ({
        ...state,
        extendedComparableLinkedTransactions,
        errorMessage: undefined,
        extendedComparableLinkedTransactionsLoading: false,
      })
    ),
    on(
      ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForQuotationDetailFailure,
      (
        state: ExtendedComparableLinkedTransactionsState,
        { errorMessage }
      ): ExtendedComparableLinkedTransactionsState => ({
        ...state,
        errorMessage,
        extendedComparableLinkedTransactions: [],
        extendedComparableLinkedTransactionsLoading: false,
      })
    )
  ),
});
