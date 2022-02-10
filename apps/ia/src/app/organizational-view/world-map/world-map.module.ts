import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MapChart } from 'echarts/charts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ChartLegendModule } from '../../shared/charts/chart-legend/chart-legend.module';
import { SharedModule } from '../../shared/shared.module';
import { AttritionDialogModule } from '../attrition-dialog/attrition-dialog.module';
import { WorldMapComponent } from './world-map.component';

echarts.use([
  TitleComponent,
  TooltipComponent,
  MapChart,
  CanvasRenderer,
  GridComponent,
]);
@NgModule({
  declarations: [WorldMapComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({ echarts }),
    LoadingSpinnerModule,
    MatButtonModule,
    AttritionDialogModule,
    ChartLegendModule,
    MatTooltipModule,
  ],
  exports: [WorldMapComponent],
})
export class WorldMapModule {}
