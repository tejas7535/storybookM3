import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CombinedLegendModule } from '../../shared/charts/external-legend/external-legend.module';
import { LooseDoughnutChartModule } from '../../shared/charts/loose-doughnut-chart/loose-doughnut-chart.module';
import { KpiModule } from '../../shared/kpi/kpi.module';
import { SharedModule } from '../../shared/shared.module';
import { EntriesExitsComponent } from './entries-exits.component';

@NgModule({
  declarations: [EntriesExitsComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    LooseDoughnutChartModule,
    CombinedLegendModule,
    KpiModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [EntriesExitsComponent],
})
export class EntriesExitsModule {}
