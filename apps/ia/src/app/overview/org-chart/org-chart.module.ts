import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '../../shared/shared.module';
import { AttritionDialogModule } from '../attrition-dialog/attrition-dialog.module';
import { TeamMemberDialogModule } from '../team-member-dialog/team-member-dialog.module';
import { OrgChartComponent } from './org-chart.component';

@NgModule({
  declarations: [OrgChartComponent],
  imports: [
    SharedModule,
    MatProgressSpinnerModule,
    AttritionDialogModule,
    TeamMemberDialogModule,
  ],
  exports: [OrgChartComponent],
})
export class OrgChartModule {}
