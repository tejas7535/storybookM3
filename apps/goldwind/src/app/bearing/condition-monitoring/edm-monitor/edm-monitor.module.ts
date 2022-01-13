import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DateRangeModule } from '../../../shared/date-range/date-range.module';
import { EmptyGraphModule } from '../../../shared/empty-graph/empty-graph.module';
import { SensorModule } from '../../../shared/sensor/sensor.module';
import { SharedModule } from '../../../shared/shared.module';
import { EdmMonitorComponent } from './edm-monitor.component';

@NgModule({
  declarations: [EdmMonitorComponent],
  imports: [
    CommonModule,
    SharedModule,
    DateRangeModule,
    SensorModule,
    EmptyGraphModule,
    NgxEchartsModule.forRoot({
      echarts: async () => import('../../../shared/chart/echarts'),
    }),

    // UI Modules
    MatCardModule,
    MatButtonModule,
    MatIconModule,

    // Translation
    SharedTranslocoModule,

    // Store
    ReactiveComponentModule,
  ],
  exports: [EdmMonitorComponent],
})
export class EdmMonitorModule {}
