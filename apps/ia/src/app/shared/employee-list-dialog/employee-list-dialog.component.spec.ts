import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  ActionType,
  Employee,
  EmployeeAction,
  EmployeeListDialogType,
} from '../models';
import { EmployeeListDialogComponent } from './employee-list-dialog.component';

describe('EmployeeListDialogComponent', () => {
  let component: EmployeeListDialogComponent;
  let spectator: Spectator<EmployeeListDialogComponent>;

  const createComponent = createComponentFactory({
    component: EmployeeListDialogComponent,
    declarations: [EmployeeListDialogComponent],
    imports: [
      MatDialogModule,
      MatButtonModule,
      MatDividerModule,
      MatListModule,
      MatChipsModule,
      MatTooltipModule,
      provideTranslocoTestingModule({ en: {} }),
      ScrollingModule,
    ],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const employee = { employeeId: '3' } as unknown as Employee;
      const result = component.trackByFn(3, employee);

      expect(result).toEqual(employee.employeeId);
    });
  });

  describe('hasExternalAction', () => {
    test('should return true when user has external entry action in entry dialog', () => {
      component.employeeListType = EmployeeListDialogType.ENTRY;
      const employee = {
        actions: [
          {
            actionType: ActionType.EXTERNAL,
            entryDate: '123',
          } as EmployeeAction,
        ],
      } as undefined as Employee;

      const result = component.hasExternalAction(employee);

      expect(result).toBeTruthy();
    });

    test('should return false when user has external entry action in exit dialog', () => {
      component.employeeListType = EmployeeListDialogType.EXIT;
      const employee = {
        actions: [
          {
            actionType: ActionType.EXTERNAL,
            entryDate: '123',
          } as EmployeeAction,
        ],
      } as undefined as Employee;

      const result = component.hasExternalAction(employee);

      expect(result).toBeFalsy();
    });

    test('should return false when user has only internal action', () => {
      component.employeeListType = EmployeeListDialogType.EXIT;
      const employee = {
        actions: [
          {
            actionType: ActionType.INTERNAL,
            exitDate: '123',
          } as EmployeeAction,
        ],
      } as undefined as Employee;

      const result = component.hasExternalAction(employee);

      expect(result).toBeFalsy();
    });

    test('should return false when user has no actions', () => {
      component.employeeListType = EmployeeListDialogType.ENTRY;
      const employee = {} as undefined as Employee;

      const result = component.hasExternalAction(employee);

      expect(result).toBeFalsy();
    });
  });

  describe('hasInternalAction', () => {
    test('should return true when user has internal entry action in entry dialog', () => {
      component.employeeListType = EmployeeListDialogType.ENTRY;
      const employee = {
        actions: [
          {
            actionType: ActionType.INTERNAL,
            entryDate: '123',
          } as EmployeeAction,
        ],
      } as undefined as Employee;

      const result = component.hasInternalAction(employee);

      expect(result).toBeTruthy();
    });

    test('should return false when user has only external action', () => {
      component.employeeListType = EmployeeListDialogType.ENTRY;
      const employee = {
        actions: [
          {
            actionType: ActionType.EXTERNAL,
            entryDate: '123',
          } as EmployeeAction,
        ],
      } as undefined as Employee;

      const result = component.hasInternalAction(employee);

      expect(result).toBeFalsy();
    });

    test('should return false when user has no actions', () => {
      component.employeeListType = EmployeeListDialogType.ENTRY;
      const employee = {} as undefined as Employee;

      const result = component.hasInternalAction(employee);

      expect(result).toBeFalsy();
    });
  });
});
