import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { getQuotation, updateQuotation } from '../core/store';
import {
  getCustomerLoading,
  getGqId,
  getQuotationLoading,
  getQuotationSapSyncStatus,
} from '../core/store/selectors';
import { Tab } from '../shared/components/tabs-header/tab.model';
import { Quotation } from '../shared/models';
import { SAP_SYNC_STATUS } from '../shared/models/quotation-detail/sap-sync-status.enum';
import { BreadcrumbsService } from '../shared/services/breadcrumbs-service/breadcrumbs.service';
import { UpdateQuotationRequest } from '../shared/services/rest-services/quotation-service/models/update-quotation-request.model';
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

  synced = SAP_SYNC_STATUS.SYNCED;
  notSynced = SAP_SYNC_STATUS.NOT_SYNCED;
  partiallySynced = SAP_SYNC_STATUS.PARTIALLY_SYNCED;

  public tabs: Tab[];

  constructor(
    private readonly store: Store,
    private readonly breadCrumbsService: BreadcrumbsService
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

    this.tabs = [
      {
        label: 'processCaseView.tabs.singleQuotes.title',
        link: ProcessCaseRoutePath.SingleQuotesPath,
      },
      {
        label: 'processCaseView.tabs.customerDetails.title',
        link: ProcessCaseRoutePath.CustomerDetailsPath,
      },
    ];
  }

  public updateQuotation(updateQuotationRequest: UpdateQuotationRequest) {
    this.store.dispatch(updateQuotation(updateQuotationRequest));
  }
}
