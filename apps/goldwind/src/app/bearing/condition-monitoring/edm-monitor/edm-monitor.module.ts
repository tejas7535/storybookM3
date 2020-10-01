import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DateRangeModule } from '../../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../../shared/empty-graph/empty-graph.module';
import { SharedModule } from '../../../shared/shared.module';
import { EdmMonitorComponent } from './edm-monitor.component';

@NgModule({
  declarations: [EdmMonitorComponent],
  imports: [
    CommonModule,
    SharedModule,
    DateRangeModule,
    EmptyGraphModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('../../../shared/chart/echarts'),
    }),

    // UI Modules
    MatCardModule,
    MatSlideToggleModule,

    // Translation
    SharedTranslocoModule,

    // Store
    ReactiveComponentModule,
  ],
  exports: [EdmMonitorComponent],
})
export class EdmMonitorModule {}
