import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GcmHeatmapCardComponent } from './gcm-heatmap-card.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
  declarations: [GcmHeatmapCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
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
