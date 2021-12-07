import { Action, createReducer, on } from '@ngrx/store';

import {
  loadExtendedComparableLinkedTransaction,
  loadExtendedComparableLinkedTransactionFailure,
  loadExtendedComparableLinkedTransactionSuccess,
} from '../../actions/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { ExtendedComparableLinkedTransaction } from './models/extended-comparable-linked-transaction';

export interface ExtendedComparableLinkedTransactionsState {
  quotationNumber: number;
  extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[];
  errorMessage: string;
  extendedComparableLinkedTransactionsLoading: boolean;
}

export const initialState: ExtendedComparableLinkedTransactionsState = {
  quotationNumber: undefined,
  extendedComparableLinkedTransactions: [],
  errorMessage: undefined,
  extendedComparableLinkedTransactionsLoading: false,
};

export const extendedComparableLinkedTransactionsReducer = createReducer(
  initialState,
  on(
    loadExtendedComparableLinkedTransaction,
    (
      state: ExtendedComparableLinkedTransactionsState,
      { quotationNumber }
    ): ExtendedComparableLinkedTransactionsState => ({
      ...state,
      quotationNumber,
      extendedComparableLinkedTransactionsLoading: true,
    })
  ),
  on(
    loadExtendedComparableLinkedTransactionSuccess,
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
    loadExtendedComparableLinkedTransactionFailure,
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
);

export function reducer(
  state: ExtendedComparableLinkedTransactionsState,
  action: Action
): ExtendedComparableLinkedTransactionsState {
  return extendedComparableLinkedTransactionsReducer(state, action);
}
