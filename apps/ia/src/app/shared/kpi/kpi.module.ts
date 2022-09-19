import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { EmployeeListDialogModule } from '../employee-list-dialog/employee-list-dialog.module';
import { KpiComponent } from './kpi.component';

@NgModule({
  declarations: [KpiComponent],
  imports: [CommonModule, MatIconModule, EmployeeListDialogModule],
  exports: [KpiComponent],
})
export class KpiModule {}
