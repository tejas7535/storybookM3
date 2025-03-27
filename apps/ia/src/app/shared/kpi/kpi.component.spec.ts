import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { EmployeeListDialogComponent } from '../dialogs/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../dialogs/employee-list-dialog/employee-list-dialog.module';
import { EmployeeListDialogMeta } from '../dialogs/employee-list-dialog/models';
import { EmployeeWithAction } from '../models';
import { SharedModule } from '../shared.module';
import { KpiComponent } from './kpi.component';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let spectator: Spectator<KpiComponent>;

  const createComponent = createComponentFactory({
    component: KpiComponent,
    detectChanges: false,
    imports: [
      SharedModule,
      MatIconModule,
      EmployeeListDialogModule,
      provideTranslocoTestingModule({ en: {} }),
      MatTooltipModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  describe('set employees', () => {
    test('should set employees and call updateDialogData', () => {
      const employees = [{} as any as EmployeeWithAction];

      component.updateDialogData = jest.fn();
      component.employees = employees;

      expect(component.employees).toEqual(employees);
      expect(component.updateDialogData).toHaveBeenCalledTimes(1);
    });
  });

  describe('set employeesLoading', () => {
    test('should set employeesLoading and call updateDialogData', () => {
      const employeesLoading = true;

      component.updateDialogData = jest.fn();
      component.employeesLoading = employeesLoading;

      expect(component.employeesLoading).toEqual(employeesLoading);
      expect(component.updateDialogData).toHaveBeenCalledTimes(1);
    });
  });

  describe('openTeamMemberDialog', () => {
    test('should open dialog with employees', () => {
      component['dialog'].open = jest.fn();
      const employee = { name: 'jason' } as any;
      component.employees = [employee];

      component.openTeamMemberDialog();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        {
          data: new EmployeeListDialogMeta(
            undefined,
            [employee],
            undefined,
            false,
            undefined
          ),
        }
      );
    });
  });

  describe('updateDialogData', () => {
    test('should update data if dialog instance available', () => {
      const dialogRef = {
        componentInstance: {},
        data: {},
      } as any;
      const testData = {};

      component.createEmployeeListDialogMeta = jest.fn(() => testData as any);

      component['_dialogRef'] = dialogRef;

      component.updateDialogData();

      expect(dialogRef.data).toEqual(testData);
      expect(component.createEmployeeListDialogMeta).toHaveBeenCalledTimes(1);
    });

    test('should do nothing when instance not available', () => {
      const dialogRef = {
        componentInstance: undefined,
        data: undefined,
      } as any;
      const testData = {};

      component.createEmployeeListDialogMeta = jest.fn(() => testData as any);

      component['_dialogRef'] = dialogRef;

      component.updateDialogData();

      expect(dialogRef.data).toBeUndefined();
      expect(component.createEmployeeListDialogMeta).not.toHaveBeenCalled();
    });

    test('should do nothing when dialog ref not available', () => {
      const testData = {};

      component.createEmployeeListDialogMeta = jest.fn(() => testData as any);

      component.updateDialogData();

      expect(component.createEmployeeListDialogMeta).not.toHaveBeenCalled();
    });
  });

  describe('createEmployeeListDialogMeta', () => {
    test('should return dialog data', () => {
      const employees = [{} as any];
      component.employees = employees;
      component.employeesLoading = true;
      component.employeesCount = 10;

      const result = component.createEmployeeListDialogMeta();

      expect(result).toEqual(
        new EmployeeListDialogMeta(undefined, employees, true, false, undefined)
      );
    });
  });

  describe('handleEmployeeLoadingDisabledStatus', () => {
    test('should return true if count zero', () => {
      component.employeesCount = 0;

      component.handleEmployeeLoadingDisabledStatus();

      expect(component.employeeLoadingDisabled).toBeTruthy();
    });

    test('should return true if count undefined', () => {
      component.employeesCount = undefined;

      component.handleEmployeeLoadingDisabledStatus();

      expect(component.employeeLoadingDisabled).toBeTruthy();
    });
  });
});
