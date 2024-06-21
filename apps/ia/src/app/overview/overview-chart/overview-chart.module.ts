import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { LineChart } from 'echarts/charts';
import {
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmployeeListDialogModule } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.module';
import { SharedModule } from '../../shared/shared.module';
import { OverviewChartComponent } from './overview-chart.component';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  LineChart,
  GraphicComponent,
  CanvasRenderer,
  GridComponent,
]);

@NgModule({
  declarations: [OverviewChartComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({ echarts }),
    MatCheckboxModule,
    SharedTranslocoModule,
    MatDialogModule,
    EmployeeListDialogModule,
    LoadingSpinnerModule,
  ],
  exports: [OverviewChartComponent],
})
export class OverviewChartModule {}
