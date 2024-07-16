import { Component, inject } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import { UserRoles } from '@gq/shared/constants';
import { Customer } from '@gq/shared/models/customer';
import {
  Coefficients,
  QuotationDetail,
} from '@gq/shared/models/quotation-detail';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { TranslocoService } from '@jsverse/transloco';
import { FilterChangedEvent, IRowNode } from 'ag-grid-community';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'gq-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss'],
})
export class TransactionViewComponent {
  private readonly translocoService: TranslocoService =
    inject(TranslocoService);

  private readonly breadCrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
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
    this.activeCaseFacade.transactions$;
  transactionsLoading$: Observable<boolean> =
    this.activeCaseFacade.transactionsLoading$;
  translationsLoaded$: Observable<boolean> = this.translocoService
    .selectTranslateObject('transactions', {}, 'transaction-view')
    .pipe(map((res) => typeof res !== 'string'));
  graphTransactions$: Observable<ComparableLinkedTransaction[]> = combineLatest(
    [
      this.activeCaseFacade.graphTransactions$,
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
