import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { StaticSafteyFactorMonitorComponent } from './static-saftey-factor-monitor.component';

@NgModule({
  declarations: [StaticSafteyFactorMonitorComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: async () => import('../../../shared/chart/echarts'),
    }),

    // UI Modules
    MatCardModule,
    MatIconModule,

    // Translation
    SharedTranslocoModule,
    ReactiveComponentModule,
  ],
  exports: [StaticSafteyFactorMonitorComponent],
})
export class StaticSafteyFactorMonitorModule {}
