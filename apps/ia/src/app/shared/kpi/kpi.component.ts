import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EmployeeListDialogMetaHeadings } from '../employee-list-dialog/employee-list-dialog-meta-headings.model';
import { EmployeeListDialogMeta } from '../employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogComponent } from '../employee-list-dialog/employee-list-dialog.component';
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
  @Input() employeeListDialogMetaHeadings: EmployeeListDialogMetaHeadings;

  constructor(private readonly dialog: MatDialog) {}

  openTeamMemberDialog(): void {
    const data = new EmployeeListDialogMeta(
      this.employeeListDialogMetaHeadings,
      this.employees
    );
    this.dialog.open(EmployeeListDialogComponent, {
      data,
    });
  }
}
