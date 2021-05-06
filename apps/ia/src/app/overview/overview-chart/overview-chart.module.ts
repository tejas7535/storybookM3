import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { OverviewChartLegendComponent } from './overview-chart-legend/overview-chart-legend.component';
import { OverviewChartComponent } from './overview-chart.component';
import { TerminatedEmployeesDialogModule } from './terminated-employees-dialog/terminated-employees-dialog.module';

@NgModule({
  declarations: [OverviewChartComponent, OverviewChartLegendComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    MatCheckboxModule,
    SharedTranslocoModule,
    MatDialogModule,
    TerminatedEmployeesDialogModule,
  ],
  exports: [OverviewChartComponent],
})
export class OverviewChartModule {}
