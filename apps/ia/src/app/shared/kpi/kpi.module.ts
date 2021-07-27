import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmployeeListDialogModule } from '../employee-list-dialog/employee-list-dialog.module';
import { KpiComponent } from './kpi.component';

@NgModule({
  declarations: [KpiComponent],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    EmployeeListDialogModule,
  ],
  exports: [KpiComponent],
})
export class KpiModule {}
