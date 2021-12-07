import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { OverviewChartComponent } from './overview-chart.component';
import { OverviewChartLegendComponent } from './overview-chart-legend/overview-chart-legend.component';
import { TerminatedEmployeesDialogModule } from './terminated-employees-dialog/terminated-employees-dialog.module';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
  GridComponent,
]);

@NgModule({
  declarations: [OverviewChartComponent, OverviewChartLegendComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({ echarts }),
    MatCheckboxModule,
    SharedTranslocoModule,
    MatDialogModule,
    TerminatedEmployeesDialogModule,
  ],
  exports: [OverviewChartComponent],
})
export class OverviewChartModule {}
