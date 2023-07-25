import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  combineLatest,
  filter,
  map,
  NEVER,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import {
  activeCaseFeature,
  getDetailViewQueryParams,
  getSelectedQuotationDetail,
} from '@gq/core/store/active-case';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { MaterialStock } from '@gq/core/store/reducers/models';
import {
  getMaterialStock,
  getMaterialStockLoading,
  getPlantMaterialDetails,
} from '@gq/core/store/selectors';
import {
  ApprovalWorkflowInformation,
  Quotation,
  QuotationStatus,
} from '@gq/shared/models';
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
export class DetailViewComponent implements OnInit, OnDestroy {
  quotation$: Observable<Quotation>;
  quotationDetail$: Observable<QuotationDetail>;
  plantMaterialDetails$: Observable<PlantMaterialDetail[]>;
  materialStock$: Observable<MaterialStock>;
  materialStockLoading$: Observable<boolean>;
  dataLoadingComplete$: Observable<boolean>;

  breadcrumbs$: Observable<Breadcrumb[]>;
  quotations: QuotationDetail[];

  sapStatusPosition$: Observable<SAP_SYNC_STATUS> = NEVER;

  readonly sapSyncStatus: typeof SAP_SYNC_STATUS = SAP_SYNC_STATUS;
  readonly quotationStatus: typeof QuotationStatus = QuotationStatus;

  private readonly shutDown$$: Subject<void> = new Subject();

  constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agGridService: AgGridStateService,
    private readonly approvalFacade: ApprovalFacade
  ) {}

  ngOnInit(): void {
    this.initObservables();
    this.requestApprovalData();

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

  ngOnDestroy(): void {
    this.shutDown$$.next();
    this.shutDown$$.complete();
  }

  private initObservables(): void {
    this.quotation$ = this.store.select(activeCaseFeature.selectQuotation);
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

    this.dataLoadingComplete$ = combineLatest([
      this.store.select(activeCaseFeature.selectQuotationLoading),
      this.quotation$,
      this.approvalFacade.approvalCockpitLoading$,
      this.approvalFacade.approvalCockpitInformation$,
    ]).pipe(
      takeUntil(this.shutDown$$),
      map(
        ([
          quotationLoading,
          quotation,
          approvalInformationLoading,
          approvalInformation,
        ]: [boolean, Quotation, boolean, ApprovalWorkflowInformation]) =>
          !quotationLoading &&
          // Approval information loading status is relevant only if the quotation is synced with SAP
          (quotation?.sapId
            ? !approvalInformationLoading && !!approvalInformation.sapId
            : true)
      )
    );
  }

  private requestApprovalData(): void {
    this.quotation$
      .pipe(
        takeUntil(this.shutDown$$),
        filter((quotation: Quotation) => !!quotation),
        map((quotation: Quotation) =>
          this.approvalFacade.getApprovalCockpitData(quotation.sapId)
        )
      )
      .subscribe();
  }

  private navigateToDetailView(gqPositionId: string): void {
    this.router.navigate([AppRoutePath.DetailViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        gqPositionId,
      },
    });
  }
}
