import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { EmployeeListDialogComponent } from '../dialogs/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogMeta } from '../dialogs/employee-list-dialog/models';
import { EmployeeListDialogMetaHeadings } from '../dialogs/employee-list-dialog/models/employee-list-dialog-meta-headings.model';
import { EmployeeWithAction } from '../models';

@Component({
  selector: 'ia-kpi',
  templateUrl: './kpi.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class KpiComponent {
  private _dialogRef: MatDialogRef<EmployeeListDialogComponent>;
  private _employees: EmployeeWithAction[];
  private _employeesLoading: boolean;
  private _employeesCount: number;

  btnColor = 'primary';
  employeeLoadingDisabled = true;
  tooltip = '';

  @Input() type: 'workforce' | 'leavers' | 'newJoiners';
  @Input() title: string;
  @Input() value: string | number;
  @Input() employeeListDialogMetaHeadings: EmployeeListDialogMetaHeadings;
  @Input() excludedColumns: string[];
  @Input() showTeamMemberDialog = true;
  @Input() showTooltip = false;
  @Input() viewRights = false;
  @Input() isLoading: boolean;

  @Output()
  readonly openTeamMembers: EventEmitter<void> = new EventEmitter();

  @Input() set employeesCount(employeesCount: number) {
    this._employeesCount = employeesCount;
    this.handleEmployeeLoadingDisabledStatus();
  }

  get employeesCount(): number {
    return this._employeesCount;
  }

  @Input() set employees(employees: EmployeeWithAction[]) {
    this._employees = employees;
    this.updateDialogData();
    this.handleEmployeeLoadingDisabledStatus();
  }

  get employees(): EmployeeWithAction[] {
    return this._employees;
  }

  @Input() set employeesLoading(employeesLoading: boolean) {
    this._employeesLoading = employeesLoading;
    this.updateDialogData();
  }

  get employeesLoading(): boolean {
    return this._employeesLoading;
  }

  constructor(private readonly dialog: MatDialog) {}

  openTeamMemberDialog(): void {
    this.openTeamMembers.emit();
    const data = this.createEmployeeListDialogMeta();
    this._dialogRef = this.dialog.open(EmployeeListDialogComponent, {
      data,
    });
  }

  updateDialogData(): void {
    if (this._dialogRef && this._dialogRef.componentInstance) {
      this._dialogRef.componentInstance.data =
        this.createEmployeeListDialogMeta();
    }
  }

  createEmployeeListDialogMeta(): EmployeeListDialogMeta {
    return new EmployeeListDialogMeta(
      this.employeeListDialogMetaHeadings,
      this.employees,
      this.employeesLoading,
      this.employeesCount === this.employees?.length,
      this.type,
      this.excludedColumns
    );
  }

  handleEmployeeLoadingDisabledStatus(): void {
    this.employeeLoadingDisabled =
      !this.employeesCount || this.employeesCount === 0;
  }
}
