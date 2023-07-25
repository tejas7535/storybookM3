import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import {
  ActiveCaseActions,
  activeCaseFeature,
  getGqId,
  getQuotationSapSyncStatus,
} from '@gq/core/store/active-case';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { Tab } from '@gq/shared/components/tabs-header/tab.model';
import {
  ApprovalWorkflowInformation,
  Quotation,
  QuotationStatus,
} from '@gq/shared/models';
import { SAP_SYNC_STATUS } from '@gq/shared/models/quotation-detail/sap-sync-status.enum';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '../app-route-path.enum';
import { ProcessCaseRoutePath } from './process-case-route-path.enum';

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

  tabs: Tab[] = [];

  readonly sapSyncStatus = SAP_SYNC_STATUS;
  readonly quotationStatus = QuotationStatus;

  private readonly shutDown$$: Subject<void> = new Subject();

  constructor(
    private readonly store: Store,
    private readonly approvalFacade: ApprovalFacade,
    private readonly breadCrumbsService: BreadcrumbsService,
    private readonly featureToggleService: FeatureToggleConfigService
  ) {}

  ngOnInit(): void {
    this.setTabs();
    this.initObservables();
    this.requestApprovalData();
  }

  updateQuotation(updateQuotationRequest: UpdateQuotationRequest) {
    this.store.dispatch(
      ActiveCaseActions.updateQuotation(updateQuotationRequest)
    );
  }

  ngOnDestroy(): void {
    this.shutDown$$.next();
    this.shutDown$$.complete();
  }

  private setTabs(): void {
    if (this.featureToggleService.isEnabled('approvalWorkflow')) {
      this.tabs.push({
        label: 'processCaseView.tabs.overview.title',
        link: ProcessCaseRoutePath.OverviewPath,
        parentPath: AppRoutePath.ProcessCaseViewPath,
      });
    }
    this.tabs.push(
      {
        label: 'processCaseView.tabs.singleQuotes.title',
        link: ProcessCaseRoutePath.SingleQuotesPath,
        parentPath: AppRoutePath.ProcessCaseViewPath,
      },
      {
        label: 'processCaseView.tabs.customerDetails.title',
        link: ProcessCaseRoutePath.CustomerDetailsPath,
        parentPath: AppRoutePath.ProcessCaseViewPath,
      }
    );
  }

  private initObservables(): void {
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
    ]).pipe(
      takeUntil(this.shutDown$$),
      map(
        ([
          customerLoading,
          quotationLoading,
          quotation,
          approvalInformationLoading,
          approvalInformation,
        ]: [
          boolean,
          boolean,
          Quotation,
          boolean,
          ApprovalWorkflowInformation
        ]) =>
          !customerLoading &&
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
}
