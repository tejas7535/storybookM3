import { Action, createReducer, on } from '@ngrx/store';

import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from '../../actions';
import { ComparableLinkedTransaction } from './models/comparable-linked-transaction.model';

export interface TransactionsState {
  gqPositionId: string;
  transactions: ComparableLinkedTransaction[];
  transactionsLoading: boolean;
  errorMessage: string;
}

export const initialState: TransactionsState = {
  gqPositionId: undefined,
  transactions: [],
  errorMessage: undefined,
  transactionsLoading: false,
};

export const transactionsReducer = createReducer(
  initialState,
  on(
    loadComparableTransactions,
    (state: TransactionsState, { gqPositionId }): TransactionsState => ({
      ...state,
      gqPositionId,
      transactionsLoading: true,
    })
  ),
  on(
    loadComparableTransactionsSuccess,
    (state: TransactionsState, { transactions }): TransactionsState => ({
      ...state,
      transactions,
      errorMessage: undefined,
      transactionsLoading: false,
    })
  ),
  on(
    loadComparableTransactionsFailure,
    (state: TransactionsState, { errorMessage }): TransactionsState => ({
      ...state,
      errorMessage,
      transactions: [],
      transactionsLoading: false,
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: TransactionsState,
  action: Action
): TransactionsState {
  return transactionsReducer(state, action);
}
