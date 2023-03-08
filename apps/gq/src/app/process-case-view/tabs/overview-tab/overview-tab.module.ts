import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
  QuotationRatingComponent,
} from './components';
import { QuotationByProductLineComponent } from './components/quotation-by-product-line/quotation-by-product-line.component';
import { QuotationByProductLineBarChartComponent } from './components/quotation-by-product-line-bar-chart/quotation-by-product-line-bar-chart.component';
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
  ],
  declarations: [
    OverviewTabComponent,
    GeneralInformationComponent,
    QuotationRatingComponent,
    QuotationByProductLineComponent,
    QuotationByProductLineBarChartComponent,
  ],
  exports: [GeneralInformationComponent, QuotationRatingComponent],
})
export class OverviewTabModule {}
