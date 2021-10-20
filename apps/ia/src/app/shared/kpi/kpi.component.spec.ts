import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { EmployeeListDialogComponent } from '../employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../employee-list-dialog/employee-list-dialog.module';
import { SharedModule } from '../shared.module';
import { KpiComponent } from './kpi.component';

describe('KpiComponent', () => {
  let component: KpiComponent;
  let spectator: Spectator<KpiComponent>;

  const createComponent = createComponentFactory({
    component: KpiComponent,
    detectChanges: false,
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
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

  describe('openTeamMemberDialog', () => {
    test('should open dialog with employees', () => {
      component['dialog'].open = jest.fn();
      const employee = { name: 'jason' } as any;
      component.employees = [employee];

      component.openTeamMemberDialog();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        { data: { headings: undefined, employees: [employee] } }
      );
    });
  });
});
