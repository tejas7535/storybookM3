import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import { OverviewCasesFacade } from '@gq/core/store/overview-cases/overview-cases.facade';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

import { ViewToggle } from '@schaeffler/view-toggle';

import { ExtendedViewToggle } from './models/extended-view-toggle';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
})
export class CaseViewComponent implements OnInit {
  caseViews$: Observable<ViewToggle[]>;

  constructor(
    readonly overviewCasesFacade: OverviewCasesFacade,
    private readonly featureToggleConfigService: FeatureToggleConfigService
  ) {}

  ngOnInit(): void {
    this.caseViews$ = this.overviewCasesFacade.viewToggles$.pipe(
      map((views: ExtendedViewToggle[]) => {
        if (this.featureToggleConfigService.isEnabled('approvalWorkflow')) {
          return views;
        }

        return views.filter((view: ExtendedViewToggle) =>
          [QuotationTab.ACTIVE, QuotationTab.ARCHIVED].includes(view.tab)
        );
      })
    );
  }

  onViewToggle(view: ViewToggle) {
    this.overviewCasesFacade.loadCasesForView(view.id);
  }
}
