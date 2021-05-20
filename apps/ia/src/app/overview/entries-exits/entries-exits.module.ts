import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { DoughnutChartModule } from './doughnut-chart/doughnut-chart.module';
import { EntriesExitsComponent } from './entries-exits.component';

@NgModule({
  declarations: [EntriesExitsComponent],
  imports: [SharedModule, SharedTranslocoModule, DoughnutChartModule],
  exports: [EntriesExitsComponent],
})
export class EntriesExitsModule {}
