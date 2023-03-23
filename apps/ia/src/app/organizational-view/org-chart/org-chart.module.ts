import { NgModule } from '@angular/core';

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
  ],
  exports: [OrgChartComponent],
})
export class OrgChartModule {}
