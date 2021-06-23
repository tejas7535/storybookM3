import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { DoughnutChartModule } from './doughnut-chart/doughnut-chart.module';
import { EntriesExitsComponent } from './entries-exits.component';

@NgModule({
  declarations: [EntriesExitsComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    DoughnutChartModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    LoadingSpinnerModule,
    SharedPipesModule,
  ],
  exports: [EntriesExitsComponent],
})
export class EntriesExitsModule {}
