import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { ShaftComponent } from './shaft.component';

@NgModule({
  declarations: [ShaftComponent],
  imports: [
    CommonModule,
    SharedModule,
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
  exports: [ShaftComponent],
})
export class ShaftModule {}
