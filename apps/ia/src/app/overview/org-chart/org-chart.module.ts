import { NgModule } from '@angular/core';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { AttritionDialogModule } from '../attrition-dialog/attrition-dialog.module';
import { TeamMemberDialogModule } from '../team-member-dialog/team-member-dialog.module';
import { OrgChartComponent } from './org-chart.component';

@NgModule({
  declarations: [OrgChartComponent],
  imports: [
    SharedModule,
    AttritionDialogModule,
    LoadingSpinnerModule,
    TeamMemberDialogModule,
    SharedTranslocoModule,
  ],
  exports: [OrgChartComponent],
})
export class OrgChartModule {}
