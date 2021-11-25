import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Employee } from '../models';
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
    it('should return index', () => {
      const employee = { employeeId: '3' } as unknown as Employee;
      const result = component.trackByFn(3, employee);

      expect(result).toEqual(employee.employeeId);
    });
  });
});
