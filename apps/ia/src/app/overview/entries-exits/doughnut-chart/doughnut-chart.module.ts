import { NgModule } from '@angular/core';

import { PieChart } from 'echarts/charts';
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { DoughnutChartComponent } from './doughnut-chart.component';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  PieChart,
  CanvasRenderer,
]);

@NgModule({
  declarations: [DoughnutChartComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({ echarts }),
    SharedTranslocoModule,
    LoadingSpinnerModule,
  ],
  exports: [DoughnutChartComponent],
})
export class DoughnutChartModule {}
