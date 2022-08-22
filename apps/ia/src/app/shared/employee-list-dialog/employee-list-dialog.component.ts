import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  ActionType,
  Employee,
  EmployeeAction,
  EmployeeListDialogType,
} from '../models';
import { EmployeeListDialogMeta } from './employee-list-dialog-meta.model';

@Component({
  selector: 'ia-employee-list-dialog',
  templateUrl: './employee-list-dialog.component.html',
})
export class EmployeeListDialogComponent {
  showFluctuationType: boolean;
  employeeListType: EmployeeListDialogType;
  enoughRightsToShowAllEmployees: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeListDialogMeta) {
    this.showFluctuationType = data.showFluctuationType;
    this.employeeListType = data.employeeListType;
    this.enoughRightsToShowAllEmployees = data.enoughRightsToShowAllEmployees;
  }

  hasExternalAction(employee: Employee): boolean {
    return employee.actions?.some(
      (action) =>
        action.actionType === ActionType.EXTERNAL &&
        this.hasRelevantActionDate(action)
    );
  }

  hasInternalAction(employee: Employee): boolean {
    return employee.actions?.some(
      (action) =>
        action.actionType === ActionType.INTERNAL &&
        this.hasRelevantActionDate(action)
    );
  }

  hasRelevantActionDate(action: EmployeeAction): boolean {
    return !!(
      (this.employeeListType === EmployeeListDialogType.EXIT &&
        action.exitDate) ||
      (this.employeeListType === EmployeeListDialogType.ENTRY &&
        action.entryDate)
    );
  }

  public trackByFn(_index: number, item: Employee): string {
    return item.employeeId;
  }
}
