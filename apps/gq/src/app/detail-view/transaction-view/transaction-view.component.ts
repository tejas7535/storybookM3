import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  getCoefficients,
  getCustomerCurrency,
  getGraphTransactions,
  getSelectedQuotationDetail,
  getTransactions,
  getTransactionsLoading,
  isQuotationLoading,
} from '../../core/store';
import { Transaction } from '../../core/store/reducers/transactions/models/transaction.model';
import {
  Coefficients,
  QuotationDetail,
} from '../../shared/models/quotation-detail';

@Component({
  selector: 'gq-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss'],
})
export class TransactionViewComponent implements OnInit {
  quotationDetail$: Observable<QuotationDetail>;
  quotationLoading$: Observable<boolean>;
  currency$: Observable<string>;
  transactions$: Observable<Transaction[]>;
  transactionsLoading$: Observable<boolean>;
  translationsLoaded$: Observable<boolean>;
  graphTransactions$: Observable<Transaction[]>;
  coefficients$: Observable<Coefficients>;

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.quotationDetail$ = this.store.select(getSelectedQuotationDetail);
    this.quotationLoading$ = this.store.select(isQuotationLoading);
    this.currency$ = this.store.select(getCustomerCurrency);
    this.translationsLoaded$ = this.translocoService
      .selectTranslateObject('transactions', {}, 'transaction-view')
      .pipe(map(() => true));
    this.transactions$ = this.store.select(getTransactions);
    this.transactionsLoading$ = this.store.select(getTransactionsLoading);
    this.graphTransactions$ = this.store.select(getGraphTransactions);
    this.coefficients$ = this.store.select(getCoefficients);
  }
}
