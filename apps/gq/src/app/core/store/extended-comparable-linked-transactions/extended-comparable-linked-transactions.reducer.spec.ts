import { ExtendedComparableLinkedTransactionsActions } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { extendedComparableLinkedTransactionsFeature } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.reducer';

import {
  EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
  EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
} from '../../../../testing/mocks';

describe('ExtendedComparableLinkedTransactions Reducer', () => {
  describe('loadExtendedComparableLinkedTransaction', () => {
    test('should set extendedComparableLinkedTransaction', () => {
      const action =
        ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForSelectedQuotationDetail();

      const state = extendedComparableLinkedTransactionsFeature.reducer(
        EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        extendedComparableLinkedTransactionsLoading: true,
      });
    });
  });
  describe('loadExtendedComparableLinkedTransactionSuccess', () => {
    test('should set state', () => {
      const extendedComparableLinkedTransactions = [
        EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
      ];
      const action =
        ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForQuotationDetailSuccess(
          {
            extendedComparableLinkedTransactions,
          }
        );

      const state = extendedComparableLinkedTransactionsFeature.reducer(
        EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        extendedComparableLinkedTransactions,
      });
    });
  });
  describe('loadExtendedComparableLinkedTransactionFailure', () => {
    test('should set state', () => {
      const errorMessage = 'error';
      const action =
        ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForQuotationDetailFailure(
          {
            errorMessage,
          }
        );

      const state = extendedComparableLinkedTransactionsFeature.reducer(
        EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
        errorMessage,
      });
    });
  });
});
