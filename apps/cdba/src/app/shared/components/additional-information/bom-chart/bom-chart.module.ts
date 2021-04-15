import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';

import { BomChartComponent } from './bom-chart.component';

@NgModule({
  declarations: [BomChartComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('../../../../shared/echarts/custom-echarts'),
    }),
    SharedTranslocoModule,
    MatIconModule,
  ],
  exports: [BomChartComponent],
})
export class BomChartModule {}
