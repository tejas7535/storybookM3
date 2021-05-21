import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Employee } from '../../../shared/models/employee.model';

@Component({
  selector: 'ia-team-member-dialog',
  templateUrl: './team-member-dialog.component.html',
})
export class TeamMemberDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Employee) {}

  public trackByFn(index: number): number {
    return index;
  }
}
