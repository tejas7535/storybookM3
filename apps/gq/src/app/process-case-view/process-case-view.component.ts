import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import {
  ActiveCaseActions,
  activeCaseFeature,
  getGqId,
  getQuotationSapSyncStatus,
} from '@gq/core/store/active-case';
import { Tab } from '@gq/shared/components/tabs-header/tab.model';
import { Quotation, QuotationStatus } from '@gq/shared/models';
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
export class ProcessCaseViewComponent implements OnInit {
  quotation$: Observable<Quotation>;
  customerLoading$: Observable<boolean>;
  quotationLoading$: Observable<boolean>;
  breadcrumbs$: Observable<Breadcrumb[]>;
  sapStatus$: Observable<SAP_SYNC_STATUS>;

  tabs: Tab[] = [];

  readonly sapSyncStatus = SAP_SYNC_STATUS;
  readonly quotationStatus = QuotationStatus;

  constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService,
    private readonly featureToggleService: FeatureToggleConfigService
  ) {}

  ngOnInit(): void {
    this.quotation$ = this.store.select(activeCaseFeature.selectQuotation);
    this.customerLoading$ = this.store.select(
      activeCaseFeature.selectCustomerLoading
    );
    this.quotationLoading$ = this.store.select(
      activeCaseFeature.selectQuotationLoading
    );

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

  updateQuotation(updateQuotationRequest: UpdateQuotationRequest) {
    this.store.dispatch(
      ActiveCaseActions.updateQuotation(updateQuotationRequest)
    );
  }
}
