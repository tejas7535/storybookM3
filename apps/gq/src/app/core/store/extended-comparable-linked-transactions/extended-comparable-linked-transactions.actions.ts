import { ExtendedComparableLinkedTransaction } from '@gq/core/store/extended-comparable-linked-transactions/models/extended-comparable-linked-transaction';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ExtendedComparableLinkedTransactionsActions = createActionGroup({
  source: 'Extended Transactions',
  events: {
    'Load Extended Comparable Linked Transactions for Selected QuotationDetail':
      emptyProps(),
    'Load Extended Comparable Linked Transactions for QuotationDetail Success':
      props<{
        extendedComparableLinkedTransactions: ExtendedComparableLinkedTransaction[];
      }>(),
    'Load Extended Comparable Linked Transactions for QuotationDetail Failure':
      props<{ errorMessage: string }>(),
  },
});
