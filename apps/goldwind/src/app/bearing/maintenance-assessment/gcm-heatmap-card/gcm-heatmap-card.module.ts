import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { GcmHeatmapCardComponent } from './gcm-heatmap-card.component';

@NgModule({
  declarations: [GcmHeatmapCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    // Translation
    SharedTranslocoModule,
    NgxEchartsModule.forRoot({
      echarts: async () =>
        /* istanbul ignore next */
        import('../../../shared/chart/echarts'),
    }),
    ReactiveComponentModule,
  ],
  exports: [GcmHeatmapCardComponent],
  providers: [],
})
export class GCMHeatmapCardModule {}
