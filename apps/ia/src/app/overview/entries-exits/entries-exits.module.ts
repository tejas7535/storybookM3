import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { TeamMemberDialogModule } from '../../organizational-view/org-chart/team-member-dialog/team-member-dialog.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { KpiModule } from '../../shared/kpi/kpi.module';
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
    TeamMemberDialogModule,
    SharedPipesModule,
    KpiModule,
  ],
  exports: [EntriesExitsComponent],
})
export class EntriesExitsModule {}
