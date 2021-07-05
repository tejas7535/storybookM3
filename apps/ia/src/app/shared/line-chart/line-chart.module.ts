import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LineChartComponent } from './line-chart.component';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
  GridComponent,
]);

@NgModule({
  declarations: [LineChartComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    NgxEchartsModule.forRoot({ echarts }),
    LoadingSpinnerModule,
  ],
  exports: [LineChartComponent],
})
export class LineChartModule {}
