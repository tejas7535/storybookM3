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

import { EmployeeWithAction } from '../models';
import { EmployeeListDialogComponent } from './employee-list-dialog.component';
import { EmployeeListDialogMeta } from './employee-list-dialog-meta.model';

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
      const employee = { employeeId: '3' } as unknown as EmployeeWithAction;
      const result = component.trackByFn(3, employee);

      expect(result).toEqual(3);
    });
  });

  describe('getListItemHeight', () => {
    test('should return height 120px when no property not set', () => {
      const data = new EmployeeListDialogMeta(
        undefined,
        undefined,
        false,
        true,
        false
      );
      const expected = '120px';

      const result = component.getListItemHeight(data);

      expect(result.height).toBe(expected);
    });

    test('should return height 140px when 140 height set', () => {
      const data = new EmployeeListDialogMeta(
        undefined,
        undefined,
        false,
        true,
        false,
        140
      );
      const expected = '140px';

      const result = component.getListItemHeight(data);

      expect(result.height).toBe(expected);
    });
  });
});
