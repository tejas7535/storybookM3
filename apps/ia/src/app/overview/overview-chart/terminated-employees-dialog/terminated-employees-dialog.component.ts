import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TerminatedEmployee } from '../../../shared/models';

@Component({
  selector: 'ia-terminated-employees-dialog',
  templateUrl: './terminated-employees-dialog.component.html',
})
export class TerminatedEmployeesDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      employees: TerminatedEmployee[];
    }
  ) {}

  public trackByFn(index: number): number {
    return index;
  }
}
