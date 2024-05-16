import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getCoefficients,
  getDetailViewQueryParams,
  getQuotationCurrency,
  getSelectedQuotationDetail,
} from '@gq/core/store/active-case/active-case.selectors';
import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import {
  getGraphTransactions,
  getTransactions,
  getTransactionsLoading,
  userHasGPCRole,
} from '@gq/core/store/selectors';
import { UserRoles } from '@gq/shared/constants';
import { Customer } from '@gq/shared/models/customer';
import {
  Coefficients,
  QuotationDetail,
} from '@gq/shared/models/quotation-detail';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { FilterChangedEvent, IRowNode } from 'ag-grid-community';

import { hasIdTokenRoles } from '@schaeffler/azure-auth';
import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'gq-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss'],
})
export class TransactionViewComponent implements OnInit {
  quotationDetail$: Observable<QuotationDetail>;
  quotationLoading$: Observable<boolean>;
  quotationCurrency$: Observable<string>;
  transactions$: Observable<ComparableLinkedTransaction[]>;
  transactionsLoading$: Observable<boolean>;
  translationsLoaded$: Observable<boolean>;
  graphTransactions$: Observable<ComparableLinkedTransaction[]>;
  coefficients$: Observable<Coefficients>;
  customer$: Observable<Customer>;
  hasGpcRole$: Observable<boolean>;
  hideRolesHint$: Observable<boolean>;

  filteredTransactionIdentifier = new BehaviorSubject<number[] | undefined>(
    undefined
  );

  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService,
    private readonly breadCrumbsService: BreadcrumbsService
  ) {}

  ngOnInit(): void {
    this.quotationDetail$ = this.store.select(getSelectedQuotationDetail);
    this.quotationLoading$ = this.store.select(
      activeCaseFeature.selectQuotationLoading
    );
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.hasGpcRole$ = this.store.pipe(userHasGPCRole);
    this.translationsLoaded$ = this.translocoService
      .selectTranslateObject('transactions', {}, 'transaction-view')
      .pipe(map((res) => typeof res !== 'string'));
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
    this.customer$ = this.store.select(activeCaseFeature.selectCustomer);
    this.breadcrumbs$ = this.store
      .select(getDetailViewQueryParams)
      .pipe(
        map((res) =>
          this.breadCrumbsService.getPriceDetailBreadcrumbs(
            res.id,
            res.queryParams,
            true
          )
        )
      );
    this.hideRolesHint$ = this.store.pipe(
      hasIdTokenRoles([UserRoles.REGION_WORLD, UserRoles.SECTOR_ALL])
    );
  }

  onFilterChanged(event: FilterChangedEvent): void {
    const filteredTransactionIdentifiers: number[] = [];
    event.api.forEachNodeAfterFilter((node: IRowNode) => {
      filteredTransactionIdentifiers.push(node.data.identifier);
    });

    this.filteredTransactionIdentifier.next(filteredTransactionIdentifiers);
  }
}
