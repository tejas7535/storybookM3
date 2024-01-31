import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmployeeListDialogModule } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.module';
import { SharedModule } from '../../shared/shared.module';
import { AttritionDialogModule } from '../attrition-dialog/attrition-dialog.module';
import { OrgChartComponent } from './org-chart.component';

@NgModule({
  declarations: [OrgChartComponent],
  imports: [
    SharedModule,
    AttritionDialogModule,
    LoadingSpinnerModule,
    EmployeeListDialogModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  exports: [OrgChartComponent],
})
export class OrgChartModule {}
