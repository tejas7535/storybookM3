import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, map, NEVER, Observable } from 'rxjs';

import { MaterialStock } from '@gq/core/store/reducers/models';
import {
  getDetailViewQueryParams,
  getMaterialStock,
  getMaterialStockLoading,
  getPlantMaterialDetails,
  getQuotation,
  getQuotationLoading,
  getSelectedQuotationDetail,
} from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '../../app-route-path.enum';
import { Quotation } from '../../shared/models';
import {
  PlantMaterialDetail,
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '../../shared/models/quotation-detail';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service/ag-grid-state.service';
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
  public plantMaterialDetails$: Observable<PlantMaterialDetail[]>;
  public materialStock$: Observable<MaterialStock>;
  public materialStockLoading$: Observable<boolean>;

  public breadcrumbs$: Observable<Breadcrumb[]>;
  public quotations: QuotationDetail[];

  public sapStatusPosition$: Observable<SAP_SYNC_STATUS> = NEVER;
  public readonly sapSyncStatus: typeof SAP_SYNC_STATUS = SAP_SYNC_STATUS;
  public constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agGridService: AgGridStateService
  ) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.quotationLoading$ = this.store.select(getQuotationLoading);
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
