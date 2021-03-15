import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SensorModule } from '../../../shared/sensor/sensor.module';
import { SharedModule } from '../../../shared/shared.module';
import { GreaseMonitorComponent } from './grease-monitor.component';

@NgModule({
  declarations: [GreaseMonitorComponent],
  imports: [
    CommonModule,
    SharedModule,
    SensorModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('../../../shared/chart/echarts'),
    }),

    // UI Modules
    MatCardModule,

    // Translation
    SharedTranslocoModule,

    // Store
    ReactiveComponentModule,
  ],
  exports: [GreaseMonitorComponent],
})
export class GreaseMonitorModule {}
