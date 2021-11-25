import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Employee } from '../models';
import { EmployeeListDialogMeta } from './employee-list-dialog-meta.model';

@Component({
  selector: 'ia-employee-list-dialog',
  templateUrl: './employee-list-dialog.component.html',
})
export class EmployeeListDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeListDialogMeta) {}

  public trackByFn(_index: number, item: Employee): string {
    return item.employeeId;
  }
}
