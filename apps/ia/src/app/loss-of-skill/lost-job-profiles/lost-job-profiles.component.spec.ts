import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { AgGridModule } from 'ag-grid-angular';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../../shared/employee-list-dialog/employee-list-dialog.module';
import { LostJobProfilesComponent } from './lost-job-profiles.component';

describe('LostJobProfilesComponent', () => {
  let component: LostJobProfilesComponent;
  let spectator: Spectator<LostJobProfilesComponent>;

  const createComponent = createComponentFactory({
    component: LostJobProfilesComponent,
    detectChanges: false,
    imports: [UnderConstructionModule, EmployeeListDialogModule, AgGridModule],
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
        employeesCount: 3,
        leaversCount: 2,
      },
    };

    beforeEach(() => {
      component['openEmployeeListDialog'] = jest.fn();
    });

    it('should collect correct data for cellType workforce', () => {
      component['handleCellClick'](params, 'workforce');

      expect(translate).toHaveBeenCalled();
      expect(component['openEmployeeListDialog']).toHaveBeenCalledWith(
        'workforce'
      );
    });

    it('should collect correct data for celltype leavers', () => {
      component['handleCellClick'](params, 'leavers');

      expect(translate).toHaveBeenCalled();
      expect(component['openEmployeeListDialog']).toHaveBeenCalledWith(
        'leavers'
      );
    });
  });

  describe('openEmployeeListDialog', () => {
    it('should open leavers dialog with correct params', () => {
      component['dialog'].open = jest.fn();

      component['openEmployeeListDialog']('leavers');

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        { data: component.leaversDialogData }
      );
    });

    it('should open workforce dialog with correct params', () => {
      component['dialog'].open = jest.fn();

      component['openEmployeeListDialog']('workforce');

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        { data: component.workforceDialogData }
      );
    });
  });

  describe('loading', () => {
    test('should show or hide loading overlay', () => {
      component.displayOrHideLoadingOverlay = jest.fn();

      component.loading = true;

      expect(component.displayOrHideLoadingOverlay).toHaveBeenCalled();
    });
  });

  describe('displayOrHideLoadingOverlay', () => {
    test('should show loading overlay when loading true', () => {
      component.gridApi = { showLoadingOverlay: (): void => {} } as GridApi;
      component.gridApi.showLoadingOverlay = jest.fn();

      component.displayOrHideLoadingOverlay(true);

      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalled();
    });

    test('should hide overlay when loading false', () => {
      component.gridApi = { hideOverlay: (): void => {} } as GridApi;
      component.gridApi.hideOverlay = jest.fn();

      component.displayOrHideLoadingOverlay(false);

      expect(component.gridApi.hideOverlay).toHaveBeenCalled();
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

  describe('countComparator', () => {
    test('should return 1 when previous value bigger than next', () => {
      const previous = { count: 5 };
      const next = { count: 3 };

      const result = component.countComparator(previous, next);

      expect(result).toBe(1);
    });

    test('should return -1 when previous value smaller than next', () => {
      const previous = { count: 5 };
      const next = { count: 8 };

      const result = component.countComparator(previous, next);

      expect(result).toBe(-1);
    });

    test('should return 0 when previous value equal next', () => {
      const previous = { count: 8 };
      const next = { count: 8 };

      const result = component.countComparator(previous, next);

      expect(result).toBe(0);
    });
  });
});
