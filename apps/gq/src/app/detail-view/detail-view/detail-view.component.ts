import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, filter, map, Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { MaterialStock } from '@gq/core/store/reducers/models';
import { RfqDataFacade } from '@gq/core/store/rfq-data/rfq-data.facade';
import { PricingAssistantModalComponent } from '@gq/f-pricing/pricing-assistant-modal/pricing-assistant-modal.component';
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

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '../../app-route-path.enum';

@Component({
  selector: 'gq-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit, OnDestroy {
  private readonly breadCrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly agGridService: AgGridStateService =
    inject(AgGridStateService);
  private readonly approvalFacade: ApprovalFacade = inject(ApprovalFacade);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
  private readonly rfqDataFacade: RfqDataFacade = inject(RfqDataFacade);

  rfqDataUpdateAvl$: Observable<boolean> = this.rfqDataFacade.rfqDataUpdateAvl$;

  quotation$: Observable<Quotation> = this.activeCaseFacade.quotation$;
  quotationDetail$: Observable<QuotationDetail> =
    this.activeCaseFacade.selectedQuotationDetail$;
  materialCostUpdateAvl$: Observable<boolean> =
    this.activeCaseFacade.materialCostUpdateAvl$;

  plantMaterialDetails$: Observable<PlantMaterialDetail[]> =
    this.activeCaseFacade.plantMaterialDetails$;
  materialStock$: Observable<MaterialStock> =
    this.activeCaseFacade.materialStock$;
  materialStockLoading$: Observable<boolean> =
    this.activeCaseFacade.materialStockLoading$;

  dataLoadingComplete$: Observable<boolean> = combineLatest([
    this.activeCaseFacade.quotationLoading$,
    this.activeCaseFacade.quotation$,
    this.approvalFacade.approvalCockpitLoading$,
    this.approvalFacade.approvalCockpitInformation$,
    this.approvalFacade.error$,
  ]).pipe(
    takeUntilDestroyed(this.destroyRef),
    map(
      ([
        quotationLoading,
        quotation,
        approvalInformationLoading,
        approvalInformation,
        error,
      ]: [boolean, Quotation, boolean, ApprovalWorkflowInformation, Error]) =>
        !quotationLoading &&
        // Approval information loading status is relevant only if the quotation is synced with SAP and the salesOrg is enabled for the customer
        (quotation?.sapId && quotation?.customer?.enabledForApprovalWorkflow
          ? !approvalInformationLoading &&
            (!!approvalInformation.sapId || !!error)
          : true)
    )
  );

  displayPricingAssistantButton$: Observable<boolean> = combineLatest([
    this.activeCaseFacade.quotationDetailIsFNumber$,
    this.activeCaseFacade.canEditQuotation$,
  ]).pipe(
    map(([isFNumber, canEditQuotation]) => isFNumber && canEditQuotation)
  );

  breadcrumbs$: Observable<Breadcrumb[]> =
    this.activeCaseFacade.detailViewQueryParams$.pipe(
      map((res) =>
        this.breadCrumbsService.getDetailViewBreadcrumbs(
          res.id,
          res.queryParams,
          false
        )
      )
    );

  sapStatusPosition$: Observable<SAP_SYNC_STATUS> = this.quotationDetail$.pipe(
    filter((quotationDetail: QuotationDetail) => !!quotationDetail),
    map((quotationDetail: QuotationDetail) => quotationDetail.sapSyncStatus)
  );

  quotations: QuotationDetail[];
  readonly sapSyncStatus: typeof SAP_SYNC_STATUS = SAP_SYNC_STATUS;
  readonly quotationStatus: typeof QuotationStatus = QuotationStatus;

  ngOnInit(): void {
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
    this.approvalFacade.stopApprovalCockpitDataPolling();
  }

  openPricingAssistant(quotationDetail: QuotationDetail): void {
    this.dialog.open(PricingAssistantModalComponent, {
      data: quotationDetail,
      width: '1000px',
      autoFocus: false,
      panelClass: 'pricing-assistant-modal',
    });
  }

  private requestApprovalData(): void {
    this.quotation$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((quotation: Quotation) => !!quotation),
        map((quotation: Quotation) =>
          this.approvalFacade.getApprovalCockpitData(
            quotation.sapId,
            quotation.customer.enabledForApprovalWorkflow
          )
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
