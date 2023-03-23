import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmployeeListDialogModule } from '../dialogs/employee-list-dialog/employee-list-dialog.module';
import { KpiComponent } from './kpi.component';

@NgModule({
  declarations: [KpiComponent],
  imports: [
    CommonModule,
    MatIconModule,
    EmployeeListDialogModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  exports: [KpiComponent],
})
export class KpiModule {}
