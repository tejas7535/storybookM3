import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ViewToggle } from '@schaeffler/view-toggle';

import {
  getDeleteLoading,
  getQuotations,
  getQuotationsLoading,
  getStatusBarForQuotationStatus,
  getViewToggles,
  loadCases,
} from '../core/store';
import { AgStatusBar } from '../shared/ag-grid/models/ag-status-bar.model';
import { ViewQuotation } from '../shared/models/quotation';

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

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.caseViews$ = this.store.select(getViewToggles);
    this.statusBar$ = this.store.select(getStatusBarForQuotationStatus);
    this.displayedQuotations$ = this.store.select(getQuotations);
    this.quotationsLoading$ = this.store.select(getQuotationsLoading);
    this.deleteLoading$ = this.store.select(getDeleteLoading);
  }

  onViewToggle(view: ViewToggle) {
    this.store.dispatch(loadCases({ status: view.id }));
  }
}
