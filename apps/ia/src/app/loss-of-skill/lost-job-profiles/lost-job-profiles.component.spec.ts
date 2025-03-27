import { translate } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ExitEntryEmployeesResponse } from '../../overview/models';
import { EmployeeListDialogComponent } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.module';
import { EmployeeListDialogMeta } from '../../shared/dialogs/employee-list-dialog/models';
import { EmployeeListDialogMetaHeadings } from '../../shared/dialogs/employee-list-dialog/models/employee-list-dialog-meta-headings.model';
import { EmployeeWithAction, IdValue } from '../../shared/models';
import { EmployeeTableEntry } from '../../shared/tables/employee-list-table/models';
import { Workforce, WorkforceResponse } from '../models';
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
      AgGridModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
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
      component.openEmployeeListDialog = jest.fn();
    });

    it('should collect correct data for cellType workforce', () => {
      component.handleCellClick(params, 'workforce');

      expect(translate).toHaveBeenCalled();
      expect(component.openEmployeeListDialog).toHaveBeenCalledWith(
        'workforce',
        undefined
      );
    });

    it('should collect correct data for celltype leavers', () => {
      component.handleCellClick(params, 'leavers');

      expect(translate).toHaveBeenCalled();
      expect(component.openEmployeeListDialog).toHaveBeenCalledWith(
        'leavers',
        undefined
      );
    });
  });

  describe('set workforceData', () => {
    test('should set employees when is not loading', () => {
      const employees: Workforce[] = [];
      const workforceData: WorkforceResponse = {
        employees,
        responseModified: false,
      };
      component.workforceDialogData = new EmployeeListDialogMeta(
        {} as EmployeeListDialogMetaHeadings,
        undefined,
        false,
        true,
        'workforce'
      );

      component.workforceData = workforceData;

      expect(component.workforceData).toEqual(workforceData);
      expect(component.workforceDialogData.employees).toEqual(employees);
    });

    test('should not set employees when is loading', () => {
      const employees: Workforce[] = [];
      const workforceData: WorkforceResponse = {
        employees,
        responseModified: false,
      };
      component.workforceDialogData = new EmployeeListDialogMeta(
        {} as EmployeeListDialogMetaHeadings,
        undefined,
        true,
        true,
        'workforce'
      );

      component.workforceData = workforceData;

      expect(component.workforceData).toEqual(workforceData);
      expect(component.workforceDialogData.employees).toBeUndefined();
    });
  });

  describe('set leaversData', () => {
    test('should set leavers when is not loading', () => {
      const employees: EmployeeWithAction[] = [];
      const leaversData: ExitEntryEmployeesResponse = {
        employees,
        responseModified: false,
      };
      component.leaversDialogData = new EmployeeListDialogMeta(
        {} as EmployeeListDialogMetaHeadings,
        undefined,
        false,
        true,
        'workforce'
      );

      component.leaversData = leaversData;

      expect(component.leaversData).toEqual(leaversData);
      expect(component.leaversDialogData.employees).toEqual(employees);
    });

    test('should not set leavers when is loading', () => {
      const leavers: EmployeeWithAction[] = [];
      const leaversData: ExitEntryEmployeesResponse = {
        employees: leavers,
        responseModified: false,
      };
      component.leaversDialogData = new EmployeeListDialogMeta(
        {} as EmployeeListDialogMetaHeadings,
        undefined,
        true,
        true,
        'leavers'
      );

      component.leaversData = leaversData;

      expect(component.leaversData).toEqual(leaversData);
      expect(component.leaversDialogData.employees).toBeUndefined();
    });
  });

  describe('set workforceLoading', () => {
    test('should set workforce when is not loading', () => {
      const workforce: EmployeeTableEntry[] = [];
      component.workforce = workforce;
      component.workforceDialogData = new EmployeeListDialogMeta(
        {} as EmployeeListDialogMetaHeadings,
        undefined,
        false,
        true,
        'workforce'
      );

      component.workforceLoading = false;

      expect(component.workforceDialogData.employees).toEqual(workforce);
      expect(component.workforceDialogData.employeesLoading).toBeFalsy();
    });

    test('should not set workforce when is loading', () => {
      const workforce: EmployeeTableEntry[] = [];
      component.workforce = workforce;
      component.workforceDialogData = new EmployeeListDialogMeta(
        {} as EmployeeListDialogMetaHeadings,
        undefined,
        false,
        true,
        'workforce'
      );

      component.workforceLoading = true;

      expect(component.workforceDialogData.employees).toBeUndefined();
      expect(component.workforceDialogData.employeesLoading).toBeTruthy();
    });
  });

  describe('openEmployeeListDialog', () => {
    it('should open leavers dialog with correct params', () => {
      component['dialog'].open = jest.fn();
      component.filters = {
        filterDimension: 'ORG UNIT',
        timeRange: 'May 2020',
        value: 'SG',
        job: 'Developer',
      };
      component.timeRange = { id: '123', value: '123|321' };

      component.openEmployeeListDialog('leavers', 'Developer');

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        { data: component.leaversDialogData }
      );
    });

    it('should open workforce dialog with correct params', () => {
      component['dialog'].open = jest.fn();
      component.filters = {
        filterDimension: 'ORG UNIT',
        timeRange: 'May 2020',
        value: 'SG',
        job: 'Developer',
      };
      component.timeRange = new IdValue('12-21', 'Jan 2020 - Mar 2020');

      component.openEmployeeListDialog('workforce', 'Developer');

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
        api: {
          autoSizeColumns: jest.fn(),
        },
      } as unknown as GridReadyEvent;

      component.onGridReady(params);

      expect(component.gridApi).toBeDefined();
      expect(params.api.autoSizeColumns).toHaveBeenCalled();
    });
  });
});
