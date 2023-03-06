import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  GeneralInformationComponent,
  QuotationRatingComponent,
} from './components';
import { OverviewTabComponent } from './overview-tab.component';
import { OverviewTabRoutingModule } from './overview-tab.routing.module';

@NgModule({
  imports: [
    CommonModule,
    OverviewTabRoutingModule,
    SharedTranslocoModule,
    KpiStatusCardComponent,
    LabelTextModule,
    HorizontalDividerModule,
    MatIconModule,
    SharedPipesModule,
    PushModule,
  ],
  declarations: [
    OverviewTabComponent,
    GeneralInformationComponent,
    QuotationRatingComponent,
  ],
  exports: [GeneralInformationComponent, QuotationRatingComponent],
})
export class OverviewTabModule {}
