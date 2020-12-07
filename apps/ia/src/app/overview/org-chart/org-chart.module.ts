import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
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
