import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { TeamMemberDialogModule } from '../../organizational-view/org-chart/team-member-dialog/team-member-dialog.module';
import { KpiComponent } from './kpi.component';

@NgModule({
  declarations: [KpiComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    TeamMemberDialogModule,
  ],
  exports: [KpiComponent],
})
export class KpiModule {}
