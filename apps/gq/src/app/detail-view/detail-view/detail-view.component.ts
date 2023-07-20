import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, map, NEVER, Observable } from 'rxjs';

import {
  activeCaseFeature,
  getDetailViewQueryParams,
  getSelectedQuotationDetail,
} from '@gq/core/store/active-case';
import { MaterialStock } from '@gq/core/store/reducers/models';
import {
  getMaterialStock,
  getMaterialStockLoading,
  getPlantMaterialDetails,
} from '@gq/core/store/selectors';
import { Quotation, QuotationStatus } from '@gq/shared/models';
import {
  PlantMaterialDetail,
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '@gq/shared/models/quotation-detail';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '../../app-route-path.enum';

@Component({
  selector: 'gq-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit {
  quotation$: Observable<Quotation>;
  quotationLoading$: Observable<boolean>;
  quotationDetail$: Observable<QuotationDetail>;
  plantMaterialDetails$: Observable<PlantMaterialDetail[]>;
  materialStock$: Observable<MaterialStock>;
  materialStockLoading$: Observable<boolean>;

  breadcrumbs$: Observable<Breadcrumb[]>;
  quotations: QuotationDetail[];

  sapStatusPosition$: Observable<SAP_SYNC_STATUS> = NEVER;

  readonly sapSyncStatus: typeof SAP_SYNC_STATUS = SAP_SYNC_STATUS;
  readonly quotationStatus: typeof QuotationStatus = QuotationStatus;

  constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agGridService: AgGridStateService
  ) {}

  ngOnInit(): void {
    this.quotation$ = this.store.select(activeCaseFeature.selectQuotation);
    this.quotationLoading$ = this.store.select(
      activeCaseFeature.selectQuotationLoading
    );
    this.quotationDetail$ = this.store.select(getSelectedQuotationDetail);

    this.sapStatusPosition$ = this.quotationDetail$.pipe(
      filter((quotationDetail: QuotationDetail) => !!quotationDetail),
      map((quotationDetail: QuotationDetail) =>
        quotationDetail.syncInSap
          ? SAP_SYNC_STATUS.SYNCED
          : SAP_SYNC_STATUS.NOT_SYNCED
      )
    );
    this.plantMaterialDetails$ = this.store.select(getPlantMaterialDetails);
    this.materialStock$ = this.store.select(getMaterialStock);
    this.materialStockLoading$ = this.store.select(getMaterialStockLoading);
    this.breadcrumbs$ = this.store
      .select(getDetailViewQueryParams)
      .pipe(
        map((res) =>
          this.breadCrumbsService.getDetailViewBreadcrumbs(
            res.id,
            res.queryParams,
            false
          )
        )
      );

    this.quotations = this.agGridService.getColumnData(
      this.route.snapshot.queryParams.quotation_number
    );
  }

  onNavigateToQuotationByIndex(newIndex: number): void {
    const gqPositionId = this.quotations[newIndex]?.gqPositionId;

    if (gqPositionId) {
      this.navigateToDetailView(gqPositionId);
    }
  }

  getSelectedQuotationIndex = (selectedQuotationId: string): number =>
    this.quotations.findIndex(
      (detail: QuotationDetail) => detail.gqPositionId === selectedQuotationId
    );

  private readonly navigateToDetailView = (gqPositionId: string): void => {
    this.router.navigate([AppRoutePath.DetailViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        gqPositionId,
      },
    });
  };
}
