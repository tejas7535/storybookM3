import { NgModule } from '@angular/core';

import { PieChart, SunburstChart } from 'echarts/charts';
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { SharedModule } from '../../shared.module';
import { SolidDoughnutChartComponent } from './solid-doughnut-chart.component';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  PieChart,
  SunburstChart,
  CanvasRenderer,
]);

@NgModule({
  declarations: [SolidDoughnutChartComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({ echarts }),
    LoadingSpinnerModule,
  ],
  exports: [SolidDoughnutChartComponent],
})
export class SolidDoughnutChartModule {}
