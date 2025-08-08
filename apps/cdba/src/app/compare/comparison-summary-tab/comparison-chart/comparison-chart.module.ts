import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BarChart, LineChart } from 'echarts/charts';
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

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ComparisonChartComponent } from './comparison-chart.component';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  BarChart,
  ToolboxComponent,
  LineChart,
  CanvasRenderer,
  GridComponent,
]);

@NgModule({
  declarations: [ComparisonChartComponent],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({ echarts }),
    SharedTranslocoModule,
  ],
  exports: [ComparisonChartComponent],
})
export class ComparisonChartModule {}
