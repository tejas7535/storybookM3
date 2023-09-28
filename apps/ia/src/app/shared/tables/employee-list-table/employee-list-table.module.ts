import { NgModule } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular';

import { SharedModule } from '../../shared.module';
import { EmployeeListTableComponent } from './employee-list-table.component';

@NgModule({
  declarations: [EmployeeListTableComponent],
  imports: [SharedModule, AgGridModule],
  exports: [EmployeeListTableComponent],
})
export class EmployeeListTableModule {}
