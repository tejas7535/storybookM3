import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ExtendedViewToggle } from '@gq/case-view/models/extended-view-toggle';
import { AgStatusBar } from '@gq/shared/ag-grid/models/ag-status-bar.model';
import { ViewQuotation } from '@gq/shared/models/quotation';
import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { Store } from '@ngrx/store';

import { OverviewCasesActions } from './overview-cases.actions';
import { overviewCasesFeature } from './overview-cases.reducer';
import * as fromOverviewCasesSelectors from './overview-cases.selectors';

@Injectable({
  providedIn: 'root',
})
export class OverviewCasesFacade {
  quotations$: Observable<ViewQuotation[]> = this.store.select(
    fromOverviewCasesSelectors.getQuotations
  );
  statusBarForQuotationStatus$: Observable<AgStatusBar> = this.store.select(
    fromOverviewCasesSelectors.getStatusBarForQuotationStatus
  );

  viewToggles$: Observable<ExtendedViewToggle[]> = this.store.select(
    fromOverviewCasesSelectors.getViewToggles
  );

  displayStatus$: Observable<QuotationStatus> = this.store.select(
    fromOverviewCasesSelectors.getDisplayStatus
  );

  quotationsLoading$: Observable<boolean> = this.store.select(
    overviewCasesFeature.selectQuotationsLoading
  );

  deleteLoading$: Observable<boolean> = this.store.select(
    overviewCasesFeature.selectDeleteLoading
  );

  selectedIds$: Observable<number[]> = this.store.select(
    overviewCasesFeature.selectSelectedCases
  );

  constructor(private readonly store: Store) {}

  selectCase(gqId: number) {
    this.store.dispatch(OverviewCasesActions.selectCase({ gqId }));
  }

  deselectCase(gqId: number) {
    this.store.dispatch(OverviewCasesActions.deselectCase({ gqId }));
  }

  loadCasesForView(viewId: number) {
    this.store.dispatch(OverviewCasesActions.loadCasesForView({ viewId }));
  }

  updateCasesStatus(gqIds: number[], status: QuotationStatus) {
    this.store.dispatch(
      OverviewCasesActions.updateCasesStatus({ gqIds, status })
    );
  }
}
