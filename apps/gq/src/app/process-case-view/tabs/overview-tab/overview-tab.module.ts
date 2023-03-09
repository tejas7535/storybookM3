import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushModule } from '@ngrx/component';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  GeneralInformationComponent,
  QuotationByProductLineOrGpsdBarChartComponent,
  QuotationByProductLineOrGpsdComponent,
  QuotationRatingComponent,
} from './components';
import { OverviewTabComponent } from './overview-tab.component';
import { OverviewTabRoutingModule } from './overview-tab.routing.module';
@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
    OverviewTabRoutingModule,
    SharedTranslocoModule,
    KpiStatusCardComponent,
    LabelTextModule,
    HorizontalDividerModule,
    MatIconModule,
    SharedPipesModule,
    PushModule,
    MatCardModule,
    MatSelectModule,
  ],
  declarations: [
    OverviewTabComponent,
    GeneralInformationComponent,
    QuotationRatingComponent,
    QuotationByProductLineOrGpsdComponent,
    QuotationByProductLineOrGpsdBarChartComponent,
  ],
  exports: [
    OverviewTabComponent,
    GeneralInformationComponent,
    QuotationRatingComponent,
    QuotationByProductLineOrGpsdComponent,
    QuotationByProductLineOrGpsdBarChartComponent,
  ],
})
export class OverviewTabModule {}
