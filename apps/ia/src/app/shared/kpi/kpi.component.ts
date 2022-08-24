import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TranslocoService } from '@ngneat/transloco';

import { EmployeeListDialogComponent } from '../employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogMeta } from '../employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogMetaHeadings } from '../employee-list-dialog/employee-list-dialog-meta-headings.model';
import { Employee, EmployeeListDialogType } from '../models';

@Component({
  selector: 'ia-kpi',
  templateUrl: './kpi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiComponent {
  private _realEmployeesCount = 0;
  private _employees: Employee[] = [];

  tooltip = '';
  btnColor = 'primary';

  @Input() title: string;
  @Input() value: string | number;
  @Input() set employees(employees: Employee[]) {
    this._employees = employees;
    this.setTooltip();
  }

  get employees(): Employee[] {
    return this._employees;
  }

  // employees might be less due to missing rights
  @Input() set realEmployeesCount(realEmployeesCount: number) {
    this._realEmployeesCount = realEmployeesCount;
    this.setTooltip();
  }

  get realEmployeesCount(): number {
    return this._realEmployeesCount;
  }

  @Input() employeeListDialogMetaHeadings: EmployeeListDialogMetaHeadings;
  @Input() showFluctuationType: boolean;
  @Input() employeeListType: EmployeeListDialogType;
  @Input() showTeamMemberDialog = true;

  constructor(
    private readonly dialog: MatDialog,
    private readonly translocoService: TranslocoService
  ) {}

  openTeamMemberDialog(): void {
    const data = new EmployeeListDialogMeta(
      this.employeeListDialogMetaHeadings,
      this.employees,
      this.employees?.length === this.realEmployeesCount,
      this.showFluctuationType,
      this.employeeListType
    );
    this.dialog.open(EmployeeListDialogComponent, {
      data,
    });
  }

  setTooltip(): void {
    if (this.employees?.length === this.realEmployeesCount) {
      this.tooltip = this.translocoService.translate(
        'accessRights.showTeamMembers'
      );
    } else if (this.employees?.length < this.realEmployeesCount) {
      this.tooltip = this.translocoService.translate(
        'accessRights.showTeamMembersPartially'
      );
    }
  }
}
