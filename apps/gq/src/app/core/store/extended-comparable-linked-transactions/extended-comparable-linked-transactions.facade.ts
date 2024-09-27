import { inject, Injectable } from '@angular/core';

import { ExtendedComparableLinkedTransactionsActions } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { extendedComparableLinkedTransactionsFeature } from '@gq/core/store/extended-comparable-linked-transactions/extended-comparable-linked-transactions.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ExtendedComparableLinkedTransactionsFacade {
  private readonly store = inject(Store);

  isErrorMessage$ = this.store.select(
    extendedComparableLinkedTransactionsFeature.selectErrorMessage
  );

  transactionsLoading$ = this.store.select(
    extendedComparableLinkedTransactionsFeature.selectExtendedComparableLinkedTransactionsLoading
  );

  loadExtendedComparableLinkedTransactionsForSelectedQuotationDetail() {
    this.store.dispatch(
      ExtendedComparableLinkedTransactionsActions.loadExtendedComparableLinkedTransactionsForSelectedQuotationDetail()
    );
  }
}
