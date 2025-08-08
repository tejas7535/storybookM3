import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BarChart } from 'echarts/charts';
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

import { ComparisonItemComponent } from './comparison-item.component';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  BarChart,
  CanvasRenderer,
  GridComponent,
]);

@NgModule({
  declarations: [ComparisonItemComponent],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({ echarts }),
    SharedTranslocoModule,
  ],
  exports: [ComparisonItemComponent],
})
export class ComparisonItemModule {}
