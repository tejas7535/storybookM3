import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LeavingType } from '../../overview/models';
import { ActionType } from '../models';
import { EmployeeListDialogMeta } from './employee-list-dialog-meta.model';

@Component({
  selector: 'ia-employee-list-dialog',
  templateUrl: './employee-list-dialog.component.html',
})
export class EmployeeListDialogComponent {
  readonly BASIC_LIST_ITEM_HEIGHT = 120;
  readonly PROPERTY_HEIGHT = 20;
  readonly LEAVING_TYPE = LeavingType;
  readonly ACTION_TYPE = ActionType;
  listItemStyle: { [key: string]: string };

  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeListDialogMeta) {
    this.listItemStyle = this.getListItemHeight(data);
  }

  getListItemHeight(data: EmployeeListDialogMeta): { [key: string]: string } {
    const listItemHeight = data.listItemHeight ?? this.BASIC_LIST_ITEM_HEIGHT;

    return { height: `${listItemHeight}px` };
  }

  trackByFn(
    index: number,
    _item: {
      employeeName: string;
      username: string;
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
