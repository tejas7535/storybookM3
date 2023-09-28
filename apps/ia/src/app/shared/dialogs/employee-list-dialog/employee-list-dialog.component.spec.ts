import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { EmployeeListTableComponent } from '../../tables/employee-list-table/employee-list-table.component';
import { EmployeeListDialogComponent } from './employee-list-dialog.component';

describe('EmployeeListDialogComponent', () => {
  let component: EmployeeListDialogComponent;
  let spectator: Spectator<EmployeeListDialogComponent>;

  const createComponent = createComponentFactory({
    component: EmployeeListDialogComponent,
    declarations: [
      EmployeeListDialogComponent,
      MockComponent(EmployeeListTableComponent),
    ],
    imports: [MatDialogModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore(),
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
});
