import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { EmployeeListDialogComponent } from '../employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../employee-list-dialog/employee-list-dialog.module';
import { Employee } from '../models';
import { SharedModule } from '../shared.module';
import { KpiComponent } from './kpi.component';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let spectator: Spectator<KpiComponent>;
  const translate = jest.fn();

  const createComponent = createComponentFactory({
    component: KpiComponent,
    detectChanges: false,
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      mockProvider(TranslocoService, { translate }),
    ],
    imports: [
      SharedModule,
      MatIconModule,
      MatTooltipModule,
      EmployeeListDialogModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  describe('set employees', () => {
    test('should set employees and call tooltip', () => {
      const employees = [{} as any as Employee];

      component.setTooltip = jest.fn();
      component.employees = employees;

      expect(component.employees).toEqual(employees);
      expect(component.setTooltip).toHaveBeenCalledTimes(1);
    });
  });

  describe('set realEmployeesCount', () => {
    test('should set realEmployeesCount and call tooltip', () => {
      const realEmployeesCount = 5;

      component.setTooltip = jest.fn();
      component.realEmployeesCount = realEmployeesCount;

      expect(component.realEmployeesCount).toEqual(realEmployeesCount);
      expect(component.setTooltip).toHaveBeenCalledTimes(1);
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

  describe('setTooltip', () => {
    const mockTranslation = 'mock';

    beforeEach(() => {
      translate.mockReturnValue(mockTranslation);
    });

    test('should set default tooltip if user has enough rights', () => {
      component.employees = [];
      component.realEmployeesCount = 0;

      component.setTooltip();

      expect(component.tooltip).toEqual(mockTranslation);
      expect(translate).toHaveBeenCalledWith('accessRights.showTeamMembers');
    });

    test('should set rights hint tooltip if user has not enough rights', () => {
      component.employees = [];
      component.realEmployeesCount = 5;

      component.setTooltip();

      expect(component.tooltip).toEqual(mockTranslation);
      expect(translate).toHaveBeenCalledWith(
        'accessRights.showTeamMembersPartially'
      );
    });
  });
});
