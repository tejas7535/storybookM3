import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { updateQuotation } from '@gq/core/store/actions';
import {
  getCustomerLoading,
  getGqId,
  getQuotation,
  getQuotationLoading,
  getQuotationSapSyncStatus,
} from '@gq/core/store/selectors';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '../app-route-path.enum';
import { Tab } from '../shared/components/tabs-header/tab.model';
import { Quotation } from '../shared/models';
import { SAP_SYNC_STATUS } from '../shared/models/quotation-detail/sap-sync-status.enum';
import { BreadcrumbsService } from '../shared/services/breadcrumbs/breadcrumbs.service';
import { UpdateQuotationRequest } from '../shared/services/rest/quotation/models/update-quotation-request.model';
import { ProcessCaseRoutePath } from './process-case-route-path.enum';

@Component({
  selector: 'gq-case-view',
  templateUrl: './process-case-view.component.html',
  styleUrls: ['./process-case-view.component.scss'],
})
export class ProcessCaseViewComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public customerLoading$: Observable<boolean>;
  public quotationLoading$: Observable<boolean>;
  public breadcrumbs$: Observable<Breadcrumb[]>;
  public sapStatus$: Observable<SAP_SYNC_STATUS>;

  public tabs: Tab[] = [];

  public readonly sapSyncStatus = SAP_SYNC_STATUS;

  constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService,
    private readonly featureToggleService: FeatureToggleConfigService
  ) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.customerLoading$ = this.store.select(getCustomerLoading);
    this.quotationLoading$ = this.store.select(getQuotationLoading);
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

  public updateQuotation(updateQuotationRequest: UpdateQuotationRequest) {
    this.store.dispatch(updateQuotation(updateQuotationRequest));
  }
}
