import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { SapPriceConditionDetail } from '@gq/core/store/reducers/models';
import {
  getCustomer,
  getDetailViewQueryParams,
  getQuotationCurrency,
  getQuotationLoading,
  getSapPriceDetails,
  getSapPriceDetailsLoading,
  getSelectedQuotationDetail,
  getTableContextQuotationForCustomerCurrency,
} from '@gq/core/store/selectors';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

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
  public quotationCurrency$: Observable<string>;
  public quotationDetail$: Observable<QuotationDetail>;
  public quotationLoading$: Observable<boolean>;
  public translationsLoaded$: Observable<boolean>;
  public sapPriceDetailsLoading$: Observable<boolean>;
  public breadcrumbs$: Observable<Breadcrumb[]>;
  public rowData$: Observable<SapPriceConditionDetail[]>;
  public tableContext$: Observable<TableContext>;
  public translation$: Observable<any>;

  ngOnInit(): void {
    this.customer$ = this.store.select(getCustomer);
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.quotationDetail$ = this.store.select(getSelectedQuotationDetail);
    this.quotationLoading$ = this.store.select(getQuotationLoading);
    this.sapPriceDetailsLoading$ = this.store.select(getSapPriceDetailsLoading);
    this.rowData$ = this.store.select(getSapPriceDetails);
    this.tableContext$ = this.store.select(
      getTableContextQuotationForCustomerCurrency
    );
    this.translationsLoaded$ = this.translocoService
      .selectTranslateObject('sapView', {}, '')
      .pipe(map((value) => typeof value !== 'string'));

    this.translation$ = this.translocoService.selectTranslateObject(
      'sapView',
      {},
      ''
    );
    this.breadcrumbs$ = this.store
      .select(getDetailViewQueryParams)
      .pipe(
        map((res) =>
          this.breadCrumbsService.getPriceDetailBreadcrumbs(
            res.id,
            res.queryParams,
            false
          )
        )
      );
  }
}
