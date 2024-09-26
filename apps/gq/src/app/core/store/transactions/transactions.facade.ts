import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ComparableLinkedTransaction } from './models';
import { RecommendationType } from './models/recommendation-type.enum';
import { transactionsFeature } from './transactions.reducer';

@Injectable({
  providedIn: 'root',
})
export class TransactionsFacade {
  private readonly store: Store = inject(Store);

  transactions$: Observable<ComparableLinkedTransaction[]> = this.store.select(
    transactionsFeature.selectTransactions
  );

  recommendationType$: Observable<RecommendationType> = this.store.select(
    transactionsFeature.selectRecommendationType
  );
  transactionsLoading$: Observable<boolean> = this.store.select(
    transactionsFeature.selectTransactionsLoading
  );
  graphTransactions$: Observable<ComparableLinkedTransaction[]> =
    this.store.select(transactionsFeature.getGraphTransactions);
}
