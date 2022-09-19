import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { EmployeeListDialogComponent } from '../employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../employee-list-dialog/employee-list-dialog.module';
import { EmployeeWithAction } from '../models';
import { SharedModule } from '../shared.module';
import { KpiComponent } from './kpi.component';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let spectator: Spectator<KpiComponent>;

  const createComponent = createComponentFactory({
    component: KpiComponent,
    detectChanges: false,
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
    imports: [SharedModule, MatIconModule, EmployeeListDialogModule],
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
          data: {
            headings: undefined,
            employees: [employee],
            employeeListType: undefined,
            enoughRightsToShowAllEmployees: false,
            showFluctuationType: undefined,
          },
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

      expect(result).toEqual({
        headings: undefined,
        employees,
        employeesLoading: true,
        enoughRightsToShowAllEmployees: false,
      });
    });
  });
});
