import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { FeatureImportanceComponent } from './feature-importance.component';

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  ScatterChart,
  SVGRenderer,
  GridComponent,
]);

@NgModule({
  declarations: [FeatureImportanceComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({ echarts }),
    LoadingSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'attrition-analytics' }],
  exports: [FeatureImportanceComponent],
})
export class FeatureImportanceModule {}
