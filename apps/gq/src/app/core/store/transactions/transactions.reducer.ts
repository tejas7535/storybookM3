import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import {
  loadComparableTransactions,
  loadComparableTransactionsFailure,
  loadComparableTransactionsSuccess,
} from '../actions';
import { ComparableLinkedTransaction } from './models/comparable-linked-transaction.model';
import { RecommendationType } from './models/recommendation-type.enum';

export interface TransactionsState {
  gqPositionId: string;
  recommendationType: RecommendationType;
  transactions: ComparableLinkedTransaction[];
  transactionsLoading: boolean;
  errorMessage: string;
}

const TRANSACTION_KEY = 'transactions';

export const initialState: TransactionsState = {
  gqPositionId: undefined,
  recommendationType: undefined,
  transactions: [],
  errorMessage: undefined,
  transactionsLoading: false,
};

export const transactionsFeature = createFeature({
  name: TRANSACTION_KEY,
  reducer: createReducer(
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
      (
        state: TransactionsState,
        { comparableLinkedTransactionResponse }
      ): TransactionsState => ({
        ...state,
        transactions:
          comparableLinkedTransactionResponse.comparableLinkedTransactions,
        recommendationType:
          comparableLinkedTransactionResponse.recommendationType,
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
  ),
  extraSelectors: ({ selectTransactions }) => {
    const getGraphTransactions = createSelector(
      selectTransactions,
      (
        transactions: ComparableLinkedTransaction[]
      ): ComparableLinkedTransaction[] =>
        transactions.filter(
          (transaction) =>
            transaction.profitMargin > 0 && transaction.profitMargin < 100
        )
    );

    return { getGraphTransactions };
  },
});
