import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getGqId,
  getQuotationSapSyncStatus,
  getTabsForProcessCaseView,
} from '@gq/core/store/active-case/active-case.selectors';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { Tab } from '@gq/shared/components/tabs-header/tab.model';
import {
  ApprovalWorkflowInformation,
  Quotation,
  QuotationStatus,
} from '@gq/shared/models';
import { SAP_SYNC_STATUS } from '@gq/shared/models/quotation-detail/sap-sync-status.enum';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'gq-case-view',
  templateUrl: './process-case-view.component.html',
  styleUrls: ['./process-case-view.component.scss'],
})
export class ProcessCaseViewComponent implements OnInit, OnDestroy {
  quotation$: Observable<Quotation>;
  breadcrumbs$: Observable<Breadcrumb[]>;
  sapStatus$: Observable<SAP_SYNC_STATUS>;
  dataLoadingComplete$: Observable<boolean>;
  tabs$: Observable<Tab[]>;

  private readonly shutDown$$: Subject<void> = new Subject();

  readonly sapSyncStatus = SAP_SYNC_STATUS;
  readonly quotationStatus = QuotationStatus;
  readonly loggedInUserId$ = this.rolesFacade.loggedInUserId$;

  constructor(
    private readonly store: Store,
    private readonly approvalFacade: ApprovalFacade,
    private readonly breadCrumbsService: BreadcrumbsService,
    private readonly rolesFacade: RolesFacade
  ) {}

  ngOnInit(): void {
    this.initObservables();
    this.requestApprovalData();
  }

  updateQuotation(updateQuotationRequest: UpdateQuotationRequest) {
    this.store.dispatch(
      ActiveCaseActions.updateQuotation(updateQuotationRequest)
    );
  }

  ngOnDestroy(): void {
    this.approvalFacade.stopApprovalCockpitDataPolling();

    this.shutDown$$.next();
    this.shutDown$$.complete();
  }

  private initObservables(): void {
    this.tabs$ = this.store.select(getTabsForProcessCaseView());
    this.quotation$ = this.store.select(activeCaseFeature.selectQuotation);

    this.sapStatus$ = this.store.select(getQuotationSapSyncStatus);
    this.breadcrumbs$ = this.store
      .select(getGqId)
      .pipe(
        map((gqId) =>
          this.breadCrumbsService.getQuotationBreadcrumbsForProcessCaseView(
            gqId
          )
        )
      );

    this.dataLoadingComplete$ = combineLatest([
      this.store.select(activeCaseFeature.selectCustomerLoading),
      this.store.select(activeCaseFeature.selectQuotationLoading),
      this.quotation$,
      this.approvalFacade.approvalCockpitLoading$,
      this.approvalFacade.approvalCockpitInformation$,
      this.approvalFacade.error$,
    ]).pipe(
      takeUntil(this.shutDown$$),
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
  }

  private requestApprovalData(): void {
    this.quotation$
      .pipe(
        takeUntil(this.shutDown$$),
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
}
