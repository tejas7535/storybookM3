import { Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import { OverviewCasesFacade } from '@gq/core/store/overview-cases/overview-cases.facade';
import { AgStatusBar } from '@gq/shared/ag-grid/models/ag-status-bar.model';
import { ViewQuotation } from '@gq/shared/models/quotation';

import { ViewToggle } from '@schaeffler/view-toggle';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
  standalone: false,
})
export class CaseViewComponent {
  private readonly overviewCasesFacade = inject(OverviewCasesFacade);

  readonly caseViews$: Observable<ViewToggle[]> =
    this.overviewCasesFacade.viewToggles$;
  readonly quotationsLoading$: Observable<boolean> =
    this.overviewCasesFacade.quotationsLoading$;
  readonly deleteLoading$: Observable<boolean> =
    this.overviewCasesFacade.deleteLoading$;
  readonly quotations$: Observable<ViewQuotation[]> =
    this.overviewCasesFacade.quotations$;
  readonly statusBarForQuotationStatus$: Observable<AgStatusBar> =
    this.overviewCasesFacade.statusBarForQuotationStatus$;
  readonly activeTab$: Observable<QuotationTab> =
    this.overviewCasesFacade.activeTab$;

  onViewToggle(view: ViewToggle) {
    this.overviewCasesFacade.loadCasesForView(view.id);
  }
}
