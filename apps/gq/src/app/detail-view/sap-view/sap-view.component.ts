import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getDetailViewQueryParams,
  getQuotationCurrency,
} from '@gq/core/store/active-case/active-case.selectors';
import { SapPriceConditionDetail } from '@gq/core/store/reducers/models';
import {
  getSapPriceDetails,
  getSapPriceDetailsLoading,
} from '@gq/core/store/selectors';
import { Quotation } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

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

  customer$: Observable<Customer>;
  quotation$: Observable<Quotation>;
  quotationCurrency$: Observable<string>;
  quotationDetail$: Observable<QuotationDetail>;
  quotationLoading$: Observable<boolean>;
  translationsLoaded$: Observable<boolean>;
  sapPriceDetailsLoading$: Observable<boolean>;
  breadcrumbs$: Observable<Breadcrumb[]>;
  rowData$: Observable<SapPriceConditionDetail[]>;
  translation$: Observable<any>;

  ngOnInit(): void {
    this.customer$ = this.store.select(activeCaseFeature.selectCustomer);
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.quotationDetail$ = this.store.select(
      activeCaseFeature.getSelectedQuotationDetail
    );
    this.quotationLoading$ = this.store.select(
      activeCaseFeature.selectQuotationLoading
    );
    this.sapPriceDetailsLoading$ = this.store.select(getSapPriceDetailsLoading);
    this.rowData$ = this.store.select(getSapPriceDetails);
    this.quotation$ = this.store.select(activeCaseFeature.selectQuotation);
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
