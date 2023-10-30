import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { EmployeeListTableComponent } from '../../tables/employee-list-table/employee-list-table.component';
import { EmployeeListDialogComponent } from './employee-list-dialog.component';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
  EmployeeListDialogMetaHeadings,
} from './models';

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
      provideMockStore({}),
      {
        provide: MAT_DIALOG_DATA,
        useValue: new EmployeeListDialogMeta(
          new EmployeeListDialogMetaHeadings('xyz', 'icon'),
          [],
          false,
          true,
          'leavers'
        ),
      },
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

  describe('ngOnInit', () => {
    test('should select beautifiedFilters$', () => {
      marbles((m) => {
        const result: EmployeeListDialogMetaFilters = { value: 'abc' } as any;

        component.ngOnInit();

        m.expect(component.beautifiedFilters$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      });
    });

    test('should select defaultExcelName$', () => {
      marbles((m) => {
        const result = 'header';

        component.ngOnInit();

        m.expect(component.defaultExcelName$).toBeObservable(
          m.cold('a', {
            a: result,
          })
        );
      });
    });
  });
});
