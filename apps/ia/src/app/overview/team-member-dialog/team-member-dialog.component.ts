import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OrgChartEmployee } from '../org-chart/models/org-chart-employee.model';

@Component({
  selector: 'ia-team-member-dialog',
  templateUrl: './team-member-dialog.component.html',
})
export class TeamMemberDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: OrgChartEmployee) {}

  public trackByFn(index: number): number {
    return index;
  }
}
