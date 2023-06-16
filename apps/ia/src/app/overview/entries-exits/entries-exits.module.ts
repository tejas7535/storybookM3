import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CombinedLegendModule } from '../../shared/charts/external-legend/external-legend.module';
import { LooseDoughnutChartModule } from '../../shared/charts/loose-doughnut-chart/loose-doughnut-chart.module';
import { KpiModule } from '../../shared/kpi/kpi.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { EntriesExitsComponent } from './entries-exits.component';

@NgModule({
  declarations: [EntriesExitsComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    SharedPipesModule,
    LoadingSpinnerModule,
    LooseDoughnutChartModule,
    CombinedLegendModule,
    KpiModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [EntriesExitsComponent],
})
export class EntriesExitsModule {}
