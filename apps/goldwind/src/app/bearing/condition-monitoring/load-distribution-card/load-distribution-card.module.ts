import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmptyGraphModule } from '../../../shared/empty-graph/empty-graph.module';
import { SharedModule } from '../../../shared/shared.module';
import { LoadDistributionCardComponent } from './load-distribution-card.component';

@NgModule({
  declarations: [LoadDistributionCardComponent],
  imports: [
    CommonModule,
    SharedModule,
    EmptyGraphModule,
    NgxEchartsModule.forRoot({
      echarts: async () => import('../../../shared/chart/echarts'),
    }),

    // UI Modules
    MatCardModule,
    MatButtonModule,
    MatSliderModule,
    MatIconModule,

    // Translation
    SharedTranslocoModule,

    // Store
    ReactiveComponentModule,
  ],
  exports: [LoadDistributionCardComponent],
})
export class LoadDistributionCardModule {}
