import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LeavingType } from '../../../overview/models';
import { ActionType } from '../../models';
import { EmployeeListDialogMeta } from './employee-list-dialog-meta.model';

@Component({
  selector: 'ia-employee-list-dialog',
  templateUrl: './employee-list-dialog.component.html',
  styleUrls: ['./employee-list-dialog.component.scss'],
})
export class EmployeeListDialogComponent {
  readonly LEAVING_TYPE = LeavingType;
  readonly ACTION_TYPE = ActionType;
  listItemStyle: { [key: string]: string };
  bufferPx: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeListDialogMeta) {
    this.listItemStyle = { height: `${data.listItemHeight}px` };
    this.bufferPx = data.listItemHeight * 4;
  }

  trackByFn(
    index: number,
    _item: {
      employeeName: string;
      userId: string;
      employeeKey: string;
      positionDescription: string;
      orgUnit: string;
      actionType?: ActionType;
      entryDate?: string;
      exitDate?: string;
    }
  ): number {
    return index;
  }
}
