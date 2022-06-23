import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActionType, Employee } from '../models';
import { EmployeeListDialogMeta } from './employee-list-dialog-meta.model';

@Component({
  selector: 'ia-employee-list-dialog',
  templateUrl: './employee-list-dialog.component.html',
})
export class EmployeeListDialogComponent {
  showFluctuationType: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeListDialogMeta) {
    this.showFluctuationType = data.showFluctuationType;
  }

  hasExternalAction(employee: Employee): boolean {
    return employee.actions?.some(
      (action) => action.actionType === ActionType.EXTERNAL
    );
  }

  hasInternalAction(employee: Employee): boolean {
    return employee.actions?.some(
      (action) => action.actionType === ActionType.INTERNAL
    );
  }

  public trackByFn(_index: number, item: Employee): string {
    return item.employeeId;
  }
}
