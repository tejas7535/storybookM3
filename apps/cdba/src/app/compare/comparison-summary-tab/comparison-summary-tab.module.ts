import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { RadarChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { SelectModule } from '@schaeffler/inputs/select';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SplitAreaComponent } from '@cdba/shared/components/split-area/split-area.component';

import { ComparisonChartModule } from './comparison-chart/comparison-chart.module';
import { ComparisonItemModule } from './comparison-item/comparison-item.module';
import { ComparisonSummaryTabComponent } from './comparison-summary-tab.component';
import { ComparisonSummaryTabRoutingModule } from './comparison-summary-tab-routing.module';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  RadarChart,
  ToolboxComponent,
  CanvasRenderer,
  GridComponent,
]);

@NgModule({
  declarations: [ComparisonSummaryTabComponent],
  imports: [
    SelectModule,
    SplitAreaComponent,
    ComparisonChartModule,
    CommonModule,
    MatTableModule,
    MatIcon,
    PushPipe,
    ComparisonItemModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    ComparisonSummaryTabRoutingModule,
    NgxEchartsModule.forRoot({ echarts }),
    LoadingSpinnerModule,
    SharedTranslocoModule,
  ],
  exports: [ComparisonSummaryTabComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'compare' }],
})
export class ComparisonSummaryTabModule {}
