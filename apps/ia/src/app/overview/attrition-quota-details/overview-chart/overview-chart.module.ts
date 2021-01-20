import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { OverviewChartLegendComponent } from './overview-chart-legend/overview-chart-legend.component';
import { OverviewChartComponent } from './overview-chart.component';

@NgModule({
  declarations: [OverviewChartComponent, OverviewChartLegendComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    MatCheckboxModule,
    SharedTranslocoModule,
  ],
  exports: [OverviewChartComponent],
})
export class OverviewChartModule {}
