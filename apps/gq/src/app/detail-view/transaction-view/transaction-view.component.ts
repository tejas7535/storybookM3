import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  getCustomerCurrency,
  getGqPriceOfSelectedQuotationDetail,
  getTransactions,
  getTransactionsLoading,
  isQuotationLoading,
} from '../../core/store';
import { Transaction } from '../../core/store/reducers/transactions/models/transaction.model';

@Component({
  selector: 'gq-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss'],
})
export class TransactionViewComponent implements OnInit {
  gqPrice$: Observable<number>;
  quotationLoading$: Observable<boolean>;
  currency$: Observable<string>;
  transactions$: Observable<Transaction[]>;
  transactionsLoading$: Observable<boolean>;
  translationsLoaded$: Observable<boolean>;

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.gqPrice$ = this.store.select(getGqPriceOfSelectedQuotationDetail);
    this.quotationLoading$ = this.store.select(isQuotationLoading);
    this.currency$ = this.store.select(getCustomerCurrency);
    this.translationsLoaded$ = this.translocoService
      .selectTranslateObject('transactions', {}, 'transaction-view')
      .pipe(map(() => true));
    this.transactions$ = this.store.select(getTransactions);
    this.transactionsLoading$ = this.store.select(getTransactionsLoading);
  }
}
