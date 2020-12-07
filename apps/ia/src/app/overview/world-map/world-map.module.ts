import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../shared/shared.module';
import { WorldMapComponent } from './world-map.component';

@NgModule({
  declarations: [WorldMapComponent],
  imports: [
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    LoadingSpinnerModule,
    MatButtonModule,
    SharedTranslocoModule,
    MatTooltipModule,
  ],
  exports: [WorldMapComponent],
})
export class WorldMapModule {}
