import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';
import { ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { FeatureImportanceComponent } from './feature-importance.component';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  ScatterChart,
  CanvasRenderer,
  GridComponent,
]);

@NgModule({
  declarations: [FeatureImportanceComponent],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({ echarts }),
    ReactiveComponentModule,
  ],
  exports: [FeatureImportanceComponent],
})
export class FeatureImportanceModule {}
