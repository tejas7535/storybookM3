import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ComparableLinkedTransaction } from '../reducers/transactions/models/comparable-linked-transaction.model';
import {
  getGraphTransactions,
  getTransactions,
  getTransactionsLoading,
} from '../selectors/transactions/transactions.selector';

@Injectable({
  providedIn: 'root',
})
export class TransactionsFacade {
  private readonly store: Store = inject(Store);

  transactions$: Observable<ComparableLinkedTransaction[]> =
    this.store.select(getTransactions);
  transactionsLoading$: Observable<boolean> = this.store.select(
    getTransactionsLoading
  );
  graphTransactions$: Observable<ComparableLinkedTransaction[]> =
    this.store.select(getGraphTransactions);
}
