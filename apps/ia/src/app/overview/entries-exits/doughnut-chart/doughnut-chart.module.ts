import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { DoughnutChartComponent } from './doughnut-chart.component';

@NgModule({
  declarations: [DoughnutChartComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    SharedTranslocoModule,
  ],
  exports: [DoughnutChartComponent],
})
export class DoughnutChartModule {}
