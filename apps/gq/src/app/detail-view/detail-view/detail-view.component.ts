import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '../../app-route-path.enum';
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
import { AgGridStateService } from '../../shared/services/ag-grid-state.service/ag-grid-state.service';
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
  public quotations: QuotationDetail[];

  private readonly subscription: Subscription = new Subscription();

  public constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agGridService: AgGridStateService
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

    this.quotations = this.agGridService.getColumnData(
      this.route.snapshot.queryParams.quotation_number
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onNavigateToQuotationByIndex(newIndex: number): void {
    const gqPositionId = this.quotations[newIndex]?.gqPositionId;

    if (gqPositionId) {
      this.navigateToDetailView(gqPositionId);
    }
  }

  private readonly navigateToDetailView = (gqPositionId: string): void => {
    this.router.navigate([AppRoutePath.DetailViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        gqPositionId,
      },
    });
  };

  getSelectedQuotationIndex = (selectedQuotationId: string): number =>
    this.quotations.findIndex(
      (detail: QuotationDetail) => detail.gqPositionId === selectedQuotationId
    );
}
