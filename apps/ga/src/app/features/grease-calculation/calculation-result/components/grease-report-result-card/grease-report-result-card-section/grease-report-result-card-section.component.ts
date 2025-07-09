import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoModule } from '@jsverse/transloco';

import { BadgeComponent } from '@ga/shared/components/badge/badge.component';
import { PartnerVersion } from '@ga/shared/models';

import { GreaseResult, ResultSection } from '../../../models';
import { GreaseReportResultCardSectionLabelValuesComponent } from '../grease-report-result-card-section-label-values/grease-report-result-card-section-label-values.component';

@Component({
  selector: 'ga-grease-report-result-card-section',
  templateUrl: './grease-report-result-card-section.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    GreaseReportResultCardSectionLabelValuesComponent,
    BadgeComponent,
  ],
})
export class GreaseReportResultCardSectionComponent {
  public section = input.required<ResultSection>();
  public greaseResult = input<GreaseResult | undefined>();
  public automaticLubrication = input(false);
  public partnerVersion = input<`${PartnerVersion}` | undefined>();

  public opened = signal(false);

  protected handleExpansion() {
    if (this.section().extendable) {
      this.opened.set(!this.opened());
    }
  }
}
