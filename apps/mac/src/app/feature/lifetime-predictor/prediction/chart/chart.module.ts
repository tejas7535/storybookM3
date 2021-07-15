import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ChartComponent } from './chart.component';
import { LegendComponent } from './legend/legend.component';

@NgModule({
  declarations: [ChartComponent, LegendComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
    FlexLayoutModule,
    NgxEchartsModule.forRoot({
      echarts: async () => import('echarts'),
    }),
  ],
  exports: [ChartComponent, LegendComponent],
})
export class ChartModule {}
