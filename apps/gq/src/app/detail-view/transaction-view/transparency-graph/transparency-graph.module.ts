import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { TransparencyGraphComponent } from './transparency-graph.component';

@NgModule({
  declarations: [TransparencyGraphComponent],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
    SharedTranslocoModule,
  ],
  exports: [TransparencyGraphComponent],
})
export class TransparencyGraphModule {}
