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

import { SharedModule } from '../../shared.module';
import { LooseDoughnutChartComponent } from './loose-doughnut-chart.component';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  PieChart,
  CanvasRenderer,
]);

@NgModule({
  declarations: [LooseDoughnutChartComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({ echarts }),
    SharedTranslocoModule,
    LoadingSpinnerModule,
  ],
  exports: [LooseDoughnutChartComponent],
})
export class LooseDoughnutChartModule {}
