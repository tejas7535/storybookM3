import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
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
    LoadingSpinnerModule,
  ],
  exports: [LineChartComponent],
})
export class LineChartModule {}
