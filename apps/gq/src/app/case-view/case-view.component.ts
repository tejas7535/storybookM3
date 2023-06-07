import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { OverviewCasesFacade } from '@gq/core/store/overview-cases/overview-cases.facade';
import { QuotationStatus } from '@gq/shared/models/quotation';
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
          [QuotationStatus.ACTIVE, QuotationStatus.ARCHIVED].includes(
            view.status
          )
        );
      })
    );
  }

  onViewToggle(view: ViewToggle) {
    this.overviewCasesFacade.loadCasesForView(view.id);
  }
}
