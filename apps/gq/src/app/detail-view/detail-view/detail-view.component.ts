import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getDetailViewQueryParams,
  getQuotation,
  getSelectedQuotationDetail,
  isQuotationLoading,
} from '../../core/store';
import { Breadcrumb } from '../../shared/header/case-header/breadcrumbs/breadcrumb.model';
import { Quotation } from '../../shared/models';
import { QuotationDetail } from '../../shared/models/quotation-detail';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs-service/breadcrumbs.service';

@Component({
  selector: 'gq-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public quotationLoading$: Observable<boolean>;
  public quotationDetail$: Observable<QuotationDetail>;
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
