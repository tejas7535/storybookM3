import { Component, inject } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import { RecommendationType } from '@gq/core/store/transactions/models/recommendation-type.enum';
import { TransactionsFacade } from '@gq/core/store/transactions/transactions.facade';
import { UserRoles } from '@gq/shared/constants';
import { Customer } from '@gq/shared/models/customer';
import {
  Coefficients,
  QuotationDetail,
} from '@gq/shared/models/quotation-detail';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { CurrencyService } from '@gq/shared/services/rest/currency/currency.service';
import { TranslocoService } from '@jsverse/transloco';
import { FilterChangedEvent, IRowNode } from 'ag-grid-enterprise';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'gq-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss'],
  standalone: false,
})
export class TransactionViewComponent {
  private readonly translocoService: TranslocoService =
    inject(TranslocoService);

  private readonly breadCrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
  private readonly transactionsFacade: TransactionsFacade =
    inject(TransactionsFacade);
  private readonly currencyService: CurrencyService = inject(CurrencyService);

  private readonly rolesFacade: RolesFacade = inject(RolesFacade);

  filteredTransactionIdentifier = new BehaviorSubject<number[] | undefined>(
    undefined
  );
  quotationDetail$: Observable<QuotationDetail> =
    this.activeCaseFacade.selectedQuotationDetail$;
  quotationLoading$: Observable<boolean> =
    this.activeCaseFacade.quotationLoading$;

  quotationCurrency$: Observable<string> =
    this.activeCaseFacade.quotationCurrency$;

  transactions$: Observable<ComparableLinkedTransaction[]> =
    this.transactionsFacade.transactions$;
  transactionsLoading$: Observable<boolean> =
    this.transactionsFacade.transactionsLoading$;
  recommendationType$: Observable<RecommendationType> =
    this.transactionsFacade.recommendationType$;

  // in case the quotation currency differs, we need the rate to adapt the calculated values for the regression function curve
  currentEurExchangeRatio$ = combineLatest([
    this.quotationCurrency$,
    this.recommendationType$,
  ]).pipe(
    filter(
      ([_currency, recommendationType]) =>
        recommendationType === RecommendationType.PRICE
    ),
    map(([currency, _recommendationType]) => currency),
    switchMap((currency) =>
      currency === 'EUR'
        ? of(1)
        : this.currencyService
            .getExchangeRateForCurrency('EUR', currency)
            .pipe(map((res) => res.exchangeRates[currency]))
    )
  );

  translationsLoaded$: Observable<boolean> = this.translocoService
    .selectTranslateObject('transactions', {}, 'transaction-view')
    .pipe(map((res) => typeof res !== 'string'));
  graphTransactions$: Observable<ComparableLinkedTransaction[]> = combineLatest(
    [
      this.transactionsFacade.graphTransactions$,
      this.filteredTransactionIdentifier,
    ]
  ).pipe(
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

  coefficients$: Observable<Coefficients> = this.activeCaseFacade.coefficients$;
  customer$: Observable<Customer> = this.activeCaseFacade.quotationCustomer$;
  hasGpcRole$: Observable<boolean> = this.rolesFacade.userHasGPCRole$;
  hideRolesHint$: Observable<boolean> = this.rolesFacade.userHasRoles$([
    UserRoles.REGION_WORLD,
    UserRoles.SECTOR_ALL,
  ]);

  breadcrumbs$: Observable<Breadcrumb[]> =
    this.activeCaseFacade.detailViewQueryParams$.pipe(
      map((res) =>
        this.breadCrumbsService.getPriceDetailBreadcrumbs(
          res.id,
          res.queryParams,
          true
        )
      )
    );

  onFilterChanged(event: FilterChangedEvent): void {
    const filteredTransactionIdentifiers: number[] = [];
    event.api.forEachNodeAfterFilter((node: IRowNode) => {
      filteredTransactionIdentifiers.push(node.data.identifier);
    });

    this.filteredTransactionIdentifier.next(filteredTransactionIdentifiers);
  }
}
