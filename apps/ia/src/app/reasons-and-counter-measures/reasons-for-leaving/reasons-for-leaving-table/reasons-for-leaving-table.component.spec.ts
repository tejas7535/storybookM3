import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { CellClickedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';

import { EmployeeListDialogComponent } from '../../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaHeadings,
} from '../../../shared/dialogs/employee-list-dialog/models';
import { EmployeeWithAction, FilterDimension } from '../../../shared/models';
import { ReasonForLeavingRank } from '../../models';
import { ReasonsForLeavingTableComponent } from './reasons-for-leaving-table.component';

describe('ReasonsForLeavingTableComponent', () => {
  let component: ReasonsForLeavingTableComponent;
  let spectator: Spectator<ReasonsForLeavingTableComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingTableComponent,
    imports: [AgGridModule],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set columnDefs', () => {
      component.columnDefs = [];

      component.ngOnInit();

      expect(component.columnDefs.length).toEqual(4);
    });
  });

  describe('leaversLoading', () => {
    test('should set leavers loading', () => {
      component.dialogMeta = {
        employeesLoading: false,
        employees: [],
      } as EmployeeListDialogMeta;

      component.leaversLoading = true;

      expect(component.dialogMeta.employeesLoading).toBeTruthy();
      expect(component.dialogMeta.employees).toBeUndefined();
    });

    test('should unset leavers loading', () => {
      component.dialogMeta = {
        employeesLoading: false,
        employees: undefined,
      } as EmployeeListDialogMeta;
      component.leavers = [{ userId: 'abc' } as EmployeeWithAction];

      component.leaversLoading = false;

      expect(component.dialogMeta.employeesLoading).toBeFalsy();
      expect(component.dialogMeta.employees).toEqual([{ userId: 'abc' }]);
    });
  });

  describe('handleCellClick', () => {
    test('should emit event and open employees dialog', () => {
      const params = { data: { reasonId: 78 } } as CellClickedEvent;
      component['dialog'].open = jest.fn();
      component.leaversRequested.emit = jest.fn();
      component.timeRange = { id: '2', value: '3' };
      component.filters = {
        filterDimension: FilterDimension.FUNCTION,
        value: '1',
        timeRange: 'Dec 2023',
      };

      component.handleCellClick(params);

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        {
          data: {
            customExcelFileName: 'translate it 1 3',
            headings: {
              customBeautifiedFilters: {
                filterDimension: FilterDimension.FUNCTION,
                timeRange: 'Dec 2023',
                value: '1',
                job: undefined,
                manager: undefined,
              },
              header: 'translate it',
              icon: 'person_add_disabled',
              showDefaultFilters: false,
            } as EmployeeListDialogMetaHeadings,
            employees: component.leavers,
            employeesLoading: undefined,
            enoughRightsToShowAllEmployees: true,
            type: 'leavers',
            excludedColumns: ['actionReason', 'reasonForLeaving'],
          } as EmployeeListDialogMeta,
        }
      );
      expect(component.leaversRequested.emit).toHaveBeenCalledWith(78);
    });
  });

  describe('onGridReady', () => {
    test('should set gridApi and show or hide loading overlay', () => {
      const event = {
        api: 'gridApi',
      } as unknown as GridReadyEvent<ReasonForLeavingRank[]>;
      component.loading = true;
      component.showOrHideLoadingOverlay = jest.fn();

      component.onGridReady(event);

      expect(component.showOrHideLoadingOverlay).toHaveBeenCalledWith(true);
      expect(component.gridApi).toEqual('gridApi');
    });
  });

  describe('showOrHideLoadingOverlay', () => {
    test('should show loading overlay', () => {
      component.gridApi = {
        showLoadingOverlay: jest.fn(),
        hideOverlay: jest.fn(),
      } as unknown as GridApi<ReasonForLeavingRank[]>;

      component.showOrHideLoadingOverlay(true);

      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalled();
      expect(component.gridApi.hideOverlay).not.toHaveBeenCalled();
    });

    test('should hide loading overlay', () => {
      component.gridApi = {
        showLoadingOverlay: jest.fn(),
        hideOverlay: jest.fn(),
      } as unknown as GridApi<ReasonForLeavingRank[]>;

      component.showOrHideLoadingOverlay(false);

      expect(component.gridApi.showLoadingOverlay).not.toHaveBeenCalled();
      expect(component.gridApi.hideOverlay).toHaveBeenCalled();
    });
  });

  describe('loading', () => {
    test('should call showOrHideLoadingOverlay', () => {
      component.showOrHideLoadingOverlay = jest.fn();
      component.loading = true;

      expect(component.showOrHideLoadingOverlay).toHaveBeenCalledWith(true);
    });
  });
});
