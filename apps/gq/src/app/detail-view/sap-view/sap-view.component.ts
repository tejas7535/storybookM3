import { Component, OnInit } from '@angular/core';

import { map, Observable, Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import {
  getCustomer,
  getDetailViewQueryParams,
  getSapPriceDetails,
  getSapPriceDetailsLoading,
  getSelectedQuotationDetail,
  getTableContextQuotation,
  isQuotationLoading,
} from '../../core/store';
import { SapPriceConditionDetail } from '../../core/store/reducers/sap-price-details/models/sap-price-condition-detail.model';
import { TableContext } from '../../process-case-view/quotation-details-table/config/tablecontext.model';
import { Customer } from '../../shared/models/customer';
import { QuotationDetail } from '../../shared/models/quotation-detail';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs-service/breadcrumbs.service';

@Component({
  selector: 'gq-sap-view',
  templateUrl: './sap-view.component.html',
})
export class SapViewComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService,
    private readonly translocoService: TranslocoService
  ) {}

  public customer$: Observable<Customer>;
  public quotationDetail$: Observable<QuotationDetail>;
  public quotationLoading$: Observable<boolean>;
  public translationsLoaded$: Observable<boolean>;
  public sapPriceDetailsLoading$: Observable<boolean>;
  public breadcrumbs: Breadcrumb[];
  public rowData$: Observable<SapPriceConditionDetail[]>;
  public tableContext$: Observable<TableContext>;

  private readonly subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.customer$ = this.store.select(getCustomer);
    this.quotationDetail$ = this.store.select(getSelectedQuotationDetail);
    this.quotationLoading$ = this.store.select(isQuotationLoading);
    this.translationsLoaded$ = this.translocoService
      .selectTranslateObject('sapView', {}, 'sap-view')
      .pipe(map(() => true));
    this.sapPriceDetailsLoading$ = this.store.select(getSapPriceDetailsLoading);
    this.rowData$ = this.store.select(getSapPriceDetails);
    this.tableContext$ = this.store.select(getTableContextQuotation);

    this.subscription.add(
      this.store
        .select(getDetailViewQueryParams)
        .subscribe(
          (res) =>
            (this.breadcrumbs =
              this.breadCrumbsService.getPriceDetailBreadcrumbs(
                res.id,
                res.queryParams,
                false
              ))
        )
    );
  }
}
