import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { combineLatest, filter, map, Observable, tap } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { Tab } from '@gq/shared/components/tabs-header/tab.model';
import { ApprovalWorkflowInformation } from '@gq/shared/models/approval/approval-cockpit-data.model';
import { Quotation } from '@gq/shared/models/quotation/quotation.model';
import { SAP_SYNC_STATUS } from '@gq/shared/models/quotation-detail/sap-sync-status.enum';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { TagType } from '@gq/shared/utils/misc.utils';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'gq-case-view',
  templateUrl: './process-case-view.component.html',
  styleUrls: ['./process-case-view.component.scss'],
})
export class ProcessCaseViewComponent implements OnInit, OnDestroy {
  private readonly approvalFacade: ApprovalFacade = inject(ApprovalFacade);
  private readonly breadCrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  showCalcInProgress = false;
  quotation$: Observable<Quotation> = this.activeCaseFacade.quotation$;
  sapStatus$: Observable<SAP_SYNC_STATUS> =
    this.activeCaseFacade.quotationSapSyncStatus$;

  breadcrumbs$: Observable<Breadcrumb[]> =
    this.activeCaseFacade.quotationIdentifier$.pipe(
      map((identifier) =>
        this.breadCrumbsService.getQuotationBreadcrumbsForProcessCaseView(
          identifier.gqId
        )
      )
    );

  tabs$: Observable<Tab[]> = this.activeCaseFacade.tabsForProcessCaseView$;
  tagType$: Observable<TagType> = this.activeCaseFacade.tagType$;

  dataLoadingComplete$: Observable<boolean> = combineLatest([
    this.activeCaseFacade.customerLoading$,
    this.activeCaseFacade.quotationLoading$,
    this.activeCaseFacade.quotation$,
    this.approvalFacade.approvalCockpitLoading$,
    this.approvalFacade.approvalCockpitInformation$,
    this.approvalFacade.error$,
  ]).pipe(
    takeUntilDestroyed(this.destroyRef),
    map(
      ([
        customerLoading,
        quotationLoading,
        quotation,
        approvalInformationLoading,
        approvalInformation,
        error,
      ]: [
        boolean,
        boolean,
        Quotation,
        boolean,
        ApprovalWorkflowInformation,
        Error,
      ]) =>
        !customerLoading &&
        !quotationLoading &&
        // Approval information loading status is relevant only if the quotation is synced with SAP and the salesOrg is enabled for the customer
        (quotation?.sapId && quotation?.customer?.enabledForApprovalWorkflow
          ? !approvalInformationLoading &&
            (!!approvalInformation.sapId || !!error)
          : true)
    )
  );
  readonly loggedInUserId$ = this.rolesFacade.loggedInUserId$;

  ngOnInit(): void {
    this.requestApprovalData();
  }

  ngOnDestroy(): void {
    this.approvalFacade.stopApprovalCockpitDataPolling();
  }

  updateQuotation(updateQuotationRequest: UpdateQuotationRequest) {
    this.activeCaseFacade.updateQuotation(updateQuotationRequest);
  }
  private requestApprovalData(): void {
    this.quotation$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((quotation: Quotation) => !!quotation),
        tap((quotation: Quotation) => {
          // when GQ call or SAP call is running the "we are syncing your case" will be shown only when sapSyncStatus is not SYNC_PENDING
          this.showCalcInProgress = quotation.calculationInProgress;
        }),
        map((quotation: Quotation) => {
          if (quotation.sapSyncStatus === SAP_SYNC_STATUS.SYNCED) {
            // if a quote was fully synced, the approval data should be reloaded because net value and gpm might have changed
            const hideLoadingSpinner = true;
            const forceLoad = true;
            this.approvalFacade.getApprovalCockpitData(
              quotation.sapId,
              quotation.customer.enabledForApprovalWorkflow,
              forceLoad,
              hideLoadingSpinner
            );
          }
        })
      )
      .subscribe();
  }
}
