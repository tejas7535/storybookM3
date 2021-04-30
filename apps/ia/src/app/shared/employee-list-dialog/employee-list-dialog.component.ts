import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ia-employee-list-dialog',
  templateUrl: './employee-list-dialog.component.html',
})
export class EmployeeListDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      total: number;
      employees: string[];
    }
  ) {}

  public trackByFn(index: number): number {
    return index;
  }
}
