import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { OverviewCasesFacade } from '@gq/core/store/overview-cases/overview-cases.facade';

import { ViewToggle } from '@schaeffler/view-toggle';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
})
export class CaseViewComponent implements OnInit {
  caseViews$: Observable<ViewToggle[]>;

  constructor(readonly overviewCasesFacade: OverviewCasesFacade) {}

  ngOnInit(): void {
    this.caseViews$ = this.overviewCasesFacade.viewToggles$;
  }

  onViewToggle(view: ViewToggle) {
    this.overviewCasesFacade.loadCasesForView(view.id);
  }
}
