import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActionType, EmployeeWithAction } from '../models';
import { EmployeeListDialogMeta } from './employee-list-dialog-meta.model';

@Component({
  selector: 'ia-employee-list-dialog',
  templateUrl: './employee-list-dialog.component.html',
})
export class EmployeeListDialogComponent {
  showFluctuationType: boolean;
  actionType = ActionType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeListDialogMeta) {
    this.showFluctuationType = data.showFluctuationType;
  }

  trackByFn(index: number, _item: EmployeeWithAction): number {
    return index;
  }
}
