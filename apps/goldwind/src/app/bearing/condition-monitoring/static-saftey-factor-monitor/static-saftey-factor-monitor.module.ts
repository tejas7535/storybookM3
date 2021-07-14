import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticSafteyFactorMonitorComponent } from './static-saftey-factor-monitor.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveComponentModule } from '@ngrx/component';

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
