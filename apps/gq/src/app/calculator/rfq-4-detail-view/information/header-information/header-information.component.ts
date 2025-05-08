import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-rfq-4-detail-view-header-information',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    KpiStatusCardComponent,
    LabelTextModule,
  ],
  templateUrl: './header-information.component.html',
})
export class HeaderInformationComponent {}
