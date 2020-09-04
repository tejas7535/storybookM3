import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { BomChartComponent } from './bom-chart.component';

@NgModule({
  declarations: [BomChartComponent],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [BomChartComponent],
})
export class BomChartModule {}
