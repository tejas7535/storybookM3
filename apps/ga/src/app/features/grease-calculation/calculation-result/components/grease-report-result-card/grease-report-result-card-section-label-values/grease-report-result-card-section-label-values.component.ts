import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LabelValue } from '@schaeffler/label-value';

import { BadgeComponent } from '@ga/shared/components/badge/badge.component';
import { PartnerVersion } from '@ga/shared/models';

import { CONCEPT1, GreaseResult, SUITABILITY_LABEL } from '../../../models';
import { GreaseReportConcept1Component } from '../../grease-report-concept1';
import { GreaseReportConcept1DetailComponent } from '../../grease-report-concept1-detail';

@Component({
  selector: 'ga-grease-report-result-card-section-label-values',
  templateUrl:
    './grease-report-result-card-section-label-values.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    GreaseReportConcept1Component,
    GreaseReportConcept1DetailComponent,
    BadgeComponent,
  ],
})
export class GreaseReportResultCardSectionLabelValuesComponent {
  public labelValues = input.required<LabelValue[]>();
  public greaseResult = input<GreaseResult | undefined>();
  public partnerVersion = input<`${PartnerVersion}` | undefined>();

  public showConcept1Details = signal(false);

  public concept1 = CONCEPT1;
  public notSuited = SUITABILITY_LABEL.NOT_SUITED;
  public unsuited = SUITABILITY_LABEL.UNSUITED;
}
