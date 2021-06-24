import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TeamMemberDialogComponent } from '../../organizational-view/org-chart/team-member-dialog/team-member-dialog.component';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'ia-kpi',
  templateUrl: './kpi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiComponent {
  @Input() title: string;
  @Input() value: string | number;
  @Input() employees: Employee[];

  constructor(private readonly dialog: MatDialog) {}

  openTeamMemberDialog(): void {
    this.dialog.open(TeamMemberDialogComponent, {
      data: { directLeafChildren: this.employees },
    });
  }
}
