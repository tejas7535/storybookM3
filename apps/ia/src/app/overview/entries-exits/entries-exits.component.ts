import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TeamMemberDialogComponent } from '../../organizational-view/org-chart/team-member-dialog/team-member-dialog.component';
import { Employee } from '../../shared/models/employee.model';
import { DoughnutConfig } from './doughnut-chart/models/doughnut-config.model';

@Component({
  selector: 'ia-entries-exits',
  templateUrl: './entries-exits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntriesExitsComponent {
  @Input() entriesDoughnutConfig: DoughnutConfig;
  @Input() exitsDoughnutConfig: DoughnutConfig;
  @Input() entriesCount: number;
  @Input() exitsCount: number;
  @Input() exitEmployees: Employee[] = [];

  constructor(private readonly dialog: MatDialog) {}

  openTeamMemberDialogForExits(): void {
    this.openTeamMemberDialog(this.exitEmployees);
  }

  openTeamMemberDialog(employees: Employee[]): void {
    this.dialog.open(TeamMemberDialogComponent, {
      data: { directLeafChildren: employees },
    });
  }
}
