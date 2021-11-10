import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import {
  getCoefficients,
  getCustomerCurrency,
  getDetailViewQueryParams,
  getGraphTransactions,
  getSelectedQuotationDetail,
  getTransactions,
  getTransactionsLoading,
  isQuotationLoading,
} from '../../core/store';
import { ComparableLinkedTransaction } from '../../core/store/reducers/transactions/models/comparable-linked-transaction.model';
import {
  Coefficients,
  QuotationDetail,
} from '../../shared/models/quotation-detail';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs-service/breadcrumbs.service';

@Component({
  selector: 'gq-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss'],
})
export class TransactionViewComponent implements OnInit, OnDestroy {
  quotationDetail$: Observable<QuotationDetail>;
  quotationLoading$: Observable<boolean>;
  currency$: Observable<string>;
  transactions$: Observable<ComparableLinkedTransaction[]>;
  transactionsLoading$: Observable<boolean>;
  translationsLoaded$: Observable<boolean>;
  graphTransactions$: Observable<ComparableLinkedTransaction[]>;
  coefficients$: Observable<Coefficients>;

  public breadcrumbs: Breadcrumb[];
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService,
    private readonly breadCrumbsService: BreadcrumbsService
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

    this.subscription.add(
      this.store
        .select(getDetailViewQueryParams)
        .subscribe(
          (result) =>
            (this.breadcrumbs =
              this.breadCrumbsService.getPriceDetailBreadcrumbs(
                result.id,
                result.queryParams,
                true
              ))
        )
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
