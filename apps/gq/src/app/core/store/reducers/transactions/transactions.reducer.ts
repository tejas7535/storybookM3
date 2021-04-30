import { Action, createReducer, on } from '@ngrx/store';

import { Transaction } from '../../../../core/store/reducers/transactions/models/transaction.model';
import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from '../../actions';

export interface TransactionsState {
  gqPositionId: string;
  transactions: Transaction[];
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
    (state: TransactionsState, { gqPositionId }) => ({
      ...state,
      gqPositionId,
      transactionsLoading: true,
    })
  ),
  on(
    loadComparableTransactionsSuccess,
    (state: TransactionsState, { transactions }) => ({
      ...state,
      transactions,
      errorMessage: undefined,
      transactionsLoading: false,
    })
  ),
  on(
    loadComparableTransactionsFailure,
    (state: TransactionsState, { errorMessage }) => ({
      ...state,
      errorMessage,
      transactions: [],
      transactionsLoading: false,
    })
  )
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: TransactionsState,
  action: Action
): TransactionsState {
  return transactionsReducer(state, action);
}
