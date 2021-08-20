import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BarChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { BarChartComponent } from './bar-chart.component';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  VisualMapComponent,
  MarkLineComponent,
  DataZoomComponent,
]);

@NgModule({
  declarations: [BarChartComponent],
  imports: [CommonModule, NgxEchartsModule.forRoot({ echarts })],
  exports: [BarChartComponent],
})
export class BarChartModule {}
