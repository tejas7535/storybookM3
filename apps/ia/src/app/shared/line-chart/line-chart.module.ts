import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LineChartComponent } from './line-chart.component';

@NgModule({
  declarations: [LineChartComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [LineChartComponent],
})
export class LineChartModule {}
