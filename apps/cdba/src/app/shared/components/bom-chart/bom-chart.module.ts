import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialNumberModule } from '@cdba/shared/pipes';

import { BomChartComponent } from './bom-chart.component';

@NgModule({
  declarations: [BomChartComponent],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: async () => import('../../echarts/custom-echarts'),
    }),
    SharedTranslocoModule,
    MatIconModule,
    MaterialNumberModule,
  ],
  exports: [BomChartComponent],
})
export class BomChartModule {}
