import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmptyGraphModule } from '../../../shared/empty-graph/empty-graph.module';
import { SharedModule } from '../../../shared/shared.module';
import { CenterLoadComponent } from './center-load.component';

@NgModule({
  declarations: [CenterLoadComponent],
  imports: [
    CommonModule,
    SharedModule,
    EmptyGraphModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('../../../shared/chart/echarts'),
    }),

    // UI Modules
    MatCardModule,
    MatSliderModule,

    // Translation
    SharedTranslocoModule,

    // Store
    ReactiveComponentModule,
  ],
  exports: [CenterLoadComponent],
})
export class CenterLoadModule {}
