import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { FilterChangedEvent, RowNode } from '@ag-grid-community/all-modules';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import {
  getCoefficients,
  getCustomer,
  getCustomerCurrency,
  getDetailViewQueryParams,
  getGraphTransactions,
  getSelectedQuotationDetail,
  getTransactions,
  getTransactionsLoading,
  isQuotationLoading,
} from '../../core/store';
import { ComparableLinkedTransaction } from '../../core/store/reducers/transactions/models/comparable-linked-transaction.model';
import { Customer } from '../../shared/models/customer';
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
  customer$: Observable<Customer>;

  filteredTransactionIdentifier = new BehaviorSubject<number[] | undefined>(
    undefined
  );

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
    this.graphTransactions$ = combineLatest([
      this.store.select(getGraphTransactions),
      this.filteredTransactionIdentifier,
    ]).pipe(
      map(([transactions, filteredIdentifier]: any[]) => {
        if (!filteredIdentifier) {
          return transactions;
        }

        if (filteredIdentifier.length === 0) {
          return [];
        }

        return transactions.filter((transaction: ComparableLinkedTransaction) =>
          filteredIdentifier.includes(transaction.identifier)
        );
      })
    );
    this.coefficients$ = this.store.select(getCoefficients);
    this.customer$ = this.store.select(getCustomer);

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

  onFilterChanged(event: FilterChangedEvent): void {
    const filteredTransactionIdentifiers: number[] = [];
    event.api.forEachNodeAfterFilter((node: RowNode) => {
      filteredTransactionIdentifiers.push(node.data.identifier);
    });

    this.filteredTransactionIdentifier.next(filteredTransactionIdentifiers);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
