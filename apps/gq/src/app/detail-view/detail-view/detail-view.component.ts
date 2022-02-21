import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import {
  getDetailViewQueryParams,
  getMaterialStock,
  getMaterialStockLoading,
  getQuotation,
  getSelectedQuotationDetail,
  isQuotationLoading,
} from '../../core/store';
import { MaterialStock } from '../../core/store/reducers/material-stock/models/material-stock.model';
import { Quotation } from '../../shared/models';
import { QuotationDetail } from '../../shared/models/quotation-detail';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs-service/breadcrumbs.service';
@Component({
  selector: 'gq-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit, OnDestroy {
  public quotation$: Observable<Quotation>;
  public quotationLoading$: Observable<boolean>;
  public quotationDetail$: Observable<QuotationDetail>;
  public materialStock$: Observable<MaterialStock>;
  public materialStockLoading$: Observable<boolean>;
  public breadcrumbs: Breadcrumb[];

  private readonly subscription: Subscription = new Subscription();

  public constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService
  ) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.quotationLoading$ = this.store.select(isQuotationLoading);
    this.quotationDetail$ = this.store.select(getSelectedQuotationDetail);
    this.materialStock$ = this.store.select(getMaterialStock);
    this.materialStockLoading$ = this.store.select(getMaterialStockLoading);
    this.subscription.add(
      this.store
        .select(getDetailViewQueryParams)
        .subscribe(
          (res) =>
            (this.breadcrumbs =
              this.breadCrumbsService.getDetailViewBreadcrumbs(
                res.id,
                res.queryParams,
                false
              ))
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
