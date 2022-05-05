import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { EVENT_NAMES } from '../../../../../../src/app/shared/models';
import { AppRoutePath } from '../../../../app-route-path.enum';

@Component({
  selector: 'gq-detail-button',
  templateUrl: './detail-button.component.html',
})
export class DetailButtonComponent {
  @Input() text: string;
  @Input() path: string;

  constructor(
    private readonly router: Router,
    private readonly insightsService: ApplicationInsightsService
  ) {}

  navigateClick(): void {
    this.router.navigate([`${AppRoutePath.DetailViewPath}/${this.path}`], {
      queryParamsHandling: 'preserve',
    });

    this.insightsService.logEvent(EVENT_NAMES.GQ_PRICING_DETAILS_VIEWED);
  }
}
