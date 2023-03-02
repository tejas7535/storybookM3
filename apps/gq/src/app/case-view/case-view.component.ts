import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { loadCases } from '@gq/core/store/actions';
import {
  getDeleteLoading,
  getDisplayStatus,
  getQuotations,
  getQuotationsLoading,
  getStatusBarForQuotationStatus,
  getViewToggles,
} from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { ViewToggle } from '@schaeffler/view-toggle';

import { AgStatusBar } from '../shared/ag-grid/models/ag-status-bar.model';
import { QuotationStatus, ViewQuotation } from '../shared/models/quotation';
import { FeatureToggleConfigService } from '../shared/services/feature-toggle/feature-toggle-config.service';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
})
export class CaseViewComponent implements OnInit {
  public caseViews$: Observable<ViewToggle[]>;
  public statusBar$: Observable<AgStatusBar>;
  public displayedQuotations$: Observable<ViewQuotation[]>;
  public quotationsLoading$: Observable<boolean>;
  public deleteLoading$: Observable<boolean>;
  public displayStatus$: Observable<number>;

  constructor(
    private readonly store: Store,
    private readonly featureToggleConfigService: FeatureToggleConfigService
  ) {}

  ngOnInit(): void {
    this.caseViews$ = this.store.select(getViewToggles).pipe(
      map((views: ViewToggle[]) => {
        if (this.featureToggleConfigService.isEnabled('approvalWorkflow')) {
          return views;
        }

        return views.filter((view: ViewToggle) =>
          [QuotationStatus.ACTIVE, QuotationStatus.INACTIVE].includes(view.id)
        );
      })
    );
    this.statusBar$ = this.store.select(getStatusBarForQuotationStatus);
    this.displayedQuotations$ = this.store.select(getQuotations);
    this.quotationsLoading$ = this.store.select(getQuotationsLoading);
    this.deleteLoading$ = this.store.select(getDeleteLoading);
    this.displayStatus$ = this.store.select(getDisplayStatus);
  }

  onViewToggle(view: ViewToggle) {
    this.store.dispatch(loadCases({ status: view.id }));
  }
}
