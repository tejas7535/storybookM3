import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { GeneralInformationComponent } from './components';
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
    SharedPipesModule,
  ],
  declarations: [OverviewTabComponent, GeneralInformationComponent],
  exports: [GeneralInformationComponent],
})
export class OverviewTabModule {}
