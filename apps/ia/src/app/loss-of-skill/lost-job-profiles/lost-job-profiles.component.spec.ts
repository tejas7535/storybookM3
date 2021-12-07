import { SimpleChange, SimpleChanges } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../../shared/employee-list-dialog/employee-list-dialog.module';
import { EmployeeListDialogMeta } from '../../shared/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { Employee } from '../../shared/models';
import { LostJobProfilesComponent } from './lost-job-profiles.component';

describe('LostJobProfilesComponent', () => {
  let component: LostJobProfilesComponent;
  let spectator: Spectator<LostJobProfilesComponent>;

  const createComponent = createComponentFactory({
    component: LostJobProfilesComponent,
    detectChanges: false,
    imports: [
      UnderConstructionModule,
      EmployeeListDialogModule,
      AgGridModule.withComponents([EmployeeListDialogComponent]),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleCellClick', () => {
    const params: any = {
      value: 5,
      data: {
        employees: ['Foo', 'Bar'],
        leavers: ['Donald'],
      },
    };

    beforeEach(() => {
      component['openEmployeeListDialog'] = jest.fn();
    });
    it('should collect correct data for cellType workforce', () => {
      component['handleCellClick'](params, 'workforce');

      expect(translate).toHaveBeenCalled();
      expect(component['openEmployeeListDialog']).toHaveBeenCalledWith(
        'translate it',
        ['Foo', 'Bar']
      );
    });

    it('should collect correct data for celltype leavers', () => {
      component['handleCellClick'](params, 'leavers');

      expect(translate).toHaveBeenCalled();
      expect(component['openEmployeeListDialog']).toHaveBeenCalledWith(
        'translate it',
        ['Donald']
      );
    });
  });

  describe('openEmployeeListDialog', () => {
    it('should open the dialog with correct params', () => {
      const title = 'FOO';
      const employees = ['Donald'];

      component['dialog'].open = jest.fn();

      component['openEmployeeListDialog'](title, employees);

      const data = new EmployeeListDialogMeta(
        new EmployeeListDialogMetaHeadings(
          title,
          translate('lossOfSkill.employeeListDialog.contentTitle')
        ),
        [{ employeeName: 'Donald' } as unknown as Employee]
      );

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        { data }
      );
    });
  });

  describe('ngOnChanges', () => {
    test('should show loading overlay when loading true', () => {
      component.gridApi = {} as GridApi;
      component.gridApi.showLoadingOverlay = jest.fn();
      const loadingChanges: SimpleChanges = {
        loading: { currentValue: true } as SimpleChange,
      };

      component.ngOnChanges(loadingChanges);

      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalled();
    });

    test('should not show loading overlay when loading false', () => {
      component.gridApi = {} as GridApi;
      component.gridApi.showLoadingOverlay = jest.fn();
      const loadingChanges: SimpleChanges = {
        loading: { currentValue: false } as SimpleChange,
      };

      component.ngOnChanges(loadingChanges);

      expect(component.gridApi.showLoadingOverlay).not.toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    test('should set grid api', () => {
      const params = {
        api: {},
        columnApi: {
          autoSizeColumn: jest.fn(),
        },
      } as unknown as GridReadyEvent;

      component.onGridReady(params);

      expect(component.gridApi).toBeDefined();
      expect(params.columnApi.autoSizeColumn).toHaveBeenCalled();
    });
  });
});
