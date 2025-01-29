import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import {
  CellClickedEvent,
  GridApi,
  GridReadyEvent,
  ValueGetterParams,
} from 'ag-grid-community';

import { EmployeeListDialogComponent } from '../../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
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

      expect(component.columnDefs.length).toEqual(5);
    });
  });

  test('leavers should not handle cell click when detailed reason', () => {
    component.handleCellClick = jest.fn();
    component.ngOnInit();

    component.columnDefs[3].onCellClicked({
      data: { detailedReasonId: 12 },
    } as CellClickedEvent);

    expect(component.handleCellClick).not.toHaveBeenCalled();
  });

  test('leavers should handle cell click when no detailed reason', () => {
    component.handleCellClick = jest.fn();
    component.ngOnInit();

    component.columnDefs[3].onCellClicked({ data: {} } as CellClickedEvent);

    expect(component.handleCellClick).toHaveBeenCalled();
  });

  test('answers should not handle cell click when no detailed reason', () => {
    component.handleCellClick = jest.fn();
    component.ngOnInit();

    component.columnDefs[4].onCellClicked({
      data: {},
    } as CellClickedEvent);

    expect(component.handleCellClick).not.toHaveBeenCalled();
  });

  test('answers should handle cell click when detailed reason', () => {
    component.handleCellClick = jest.fn();
    component.ngOnInit();

    component.columnDefs[4].onCellClicked({
      data: { detailedReasonId: 12 },
    } as CellClickedEvent);

    expect(component.handleCellClick).toHaveBeenCalled();
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
      const params = {
        data: { reasonId: 78, reason: 'Carrer change' },
      } as CellClickedEvent;
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
            customExcelFileName: 'translate it 1 Dec 2023 Carrer change',
            headings: {
              customBeautifiedFilters: {
                filterDimension: FilterDimension.FUNCTION,
                timeRange: 'Dec 2023',
                value: '1',
                job: undefined,
                manager: undefined,
                reason: 'Carrer change',
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
      expect(component.leaversRequested.emit).toHaveBeenCalledWith({
        reasonId: 78,
      });
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

      expect(component.showOrHideLoadingOverlay).toHaveBeenCalled();
      expect(component.gridApi).toEqual('gridApi');
    });
  });

  describe('leaversData', () => {
    test('should set leavers data', () => {
      component.dialogMeta = {
        employeesLoading: false,
        employees: [],
        enoughRightsToShowAllEmployees: true,
      } as EmployeeListDialogMeta;

      component.leaversData = {
        employees: [{ userId: 'abc' } as EmployeeWithAction],
        responseModified: true,
      };

      expect(component.leavers).toEqual([{ userId: 'abc' }]);
      expect(component.dialogMeta.employees).toEqual([{ userId: 'abc' }]);
      expect(component.dialogMeta.enoughRightsToShowAllEmployees).toBeFalsy();
    });

    test('should set leavers, employees and enoughRightsToShowAllEmployees', () => {
      component.dialogMeta = {
        employeesLoading: false,
        employees: [],
      } as EmployeeListDialogMeta;

      component.leaversData = {
        employees: [{ employeeKey: '123' } as EmployeeWithAction],
        responseModified: false,
      };

      expect(component.leavers).toEqual([{ employeeKey: '123' }]);
      expect(component.dialogMeta.employees).toEqual([{ employeeKey: '123' }]);
      expect(component.dialogMeta.enoughRightsToShowAllEmployees).toBeTruthy();
    });

    test('should set leavers and enoughRightsToShowAllEmployees and unset employees', () => {
      component.dialogMeta = {
        employeesLoading: true,
        employees: [],
      } as EmployeeListDialogMeta;

      component.leaversData = {
        employees: [{ employeeKey: '123' } as EmployeeWithAction],
        responseModified: false,
      };

      expect(component.leavers).toEqual([{ employeeKey: '123' }]);
      expect(component.dialogMeta.employees).toBeUndefined();
      expect(component.dialogMeta.enoughRightsToShowAllEmployees).toBeTruthy();
    });

    test('should set leavers and unset enoughRightsToShowAllEmployees and employees', () => {
      component.dialogMeta = {
        employeesLoading: true,
        employees: [],
      } as EmployeeListDialogMeta;

      component.leaversData = {
        employees: [{ employeeKey: '123' } as EmployeeWithAction],
        responseModified: true,
      };

      expect(component.leavers).toEqual([{ employeeKey: '123' }]);
      expect(component.dialogMeta.employees).toBeUndefined();
      expect(component.dialogMeta.enoughRightsToShowAllEmployees).toBeFalsy();
    });

    test('should do nothing when undefined', () => {
      component.dialogMeta = {
        employeesLoading: true,
        employees: [],
      } as EmployeeListDialogMeta;

      component.leaversData = undefined;

      expect(component.dialogMeta).toBe(component.dialogMeta);
    });
  });

  describe('showOrHideLoadingOverlay', () => {
    test('should show loading overlay', () => {
      component.gridApi = {
        showLoadingOverlay: jest.fn(),
        hideOverlay: jest.fn(),
      } as unknown as GridApi<ReasonForLeavingRank[]>;
      component.loading = true;

      component.showOrHideLoadingOverlay();

      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalled();
      expect(component.gridApi.hideOverlay).not.toHaveBeenCalled();
    });

    test('should hide loading overlay', () => {
      component.gridApi = {
        showLoadingOverlay: jest.fn(),
        hideOverlay: jest.fn(),
      } as unknown as GridApi<ReasonForLeavingRank[]>;
      component.loading = false;

      component.showOrHideLoadingOverlay();

      expect(component.gridApi.showLoadingOverlay).not.toHaveBeenCalled();
      expect(component.gridApi.hideOverlay).toHaveBeenCalled();
    });
  });

  describe('loading', () => {
    test('should call showOrHideLoadingOverlay', () => {
      component.showOrHideLoadingOverlay = jest.fn();
      component.loading = true;

      expect(component.showOrHideLoadingOverlay).toHaveBeenCalled();
    });
  });

  describe('getReasonValueGetter', () => {
    test('reason should get detailed reason if detailed reason defined', () => {
      const params = {
        data: { detailedReason: 'detailed reason' },
      } as ValueGetterParams<ReasonForLeavingRank, string>;
      const result = component.getReasonValueGetter(params);

      expect(result).toEqual('detailed reason');
    });

    test('reason should get reason if detailed reason undefined', () => {
      const params = { data: { reason: 'reason' } } as ValueGetterParams<
        ReasonForLeavingRank,
        string
      >;
      const result = component.getReasonValueGetter(params);

      expect(result).toEqual('reason');
    });
  });

  describe('getPercentageValueGetter', () => {
    test('should return percentage', () => {
      const params = {
        data: { percentage: 12.345 },
      } as ValueGetterParams<ReasonForLeavingRank, string>;
      const result = component.getPercentageValueGetter(params);

      expect(result).toEqual('12.3');
    });
  });

  describe('getLeaversValueGetter', () => {
    test('should return count and restrictedAccess if detailed reason undefined', () => {
      const params = {
        data: { detailedReasonId: undefined, leavers: 123 },
      } as ValueGetterParams<ReasonForLeavingRank, string>;
      const result = component.getLeaversValueGetter(params);

      expect(result).toEqual({ count: 123, restrictedAccess: false });
    });

    test('should return undefined if detailed reason defined', () => {
      const params = {
        data: { detailedReasonId: 12, leavers: 123 },
      } as ValueGetterParams<ReasonForLeavingRank, string>;
      const result = component.getLeaversValueGetter(params);

      expect(result).toBeUndefined();
    });
  });

  describe('getAnswersValueGetter', () => {
    test('should return count and restrictedAccess if detailed reason defined', () => {
      const params = {
        data: { detailedReasonId: 12, leavers: 123 },
      } as ValueGetterParams<ReasonForLeavingRank, string>;
      const result = component.getAnswersValueGetter(params);

      expect(result).toEqual({ count: 123, restrictedAccess: false });
    });

    test('should return undefined if detailed reason undefined', () => {
      const params = {
        data: { detailedReasonId: undefined, leavers: 123 },
      } as ValueGetterParams<ReasonForLeavingRank, string>;
      const result = component.getAnswersValueGetter(params);

      expect(result).toBeUndefined();
    });
  });

  describe('showOrHideAnswersColumn', () => {
    test('should show answers column when at least one detailed reason', () => {
      component['_data'] = [
        { detailedReasonId: 12 },
        { detailedReasonId: undefined },
      ] as ReasonForLeavingRank[];
      component.gridApi = {
        setColumnsVisible: jest.fn(),
      } as unknown as GridApi;

      component.showOrHideAnswersColumn();

      expect(component.gridApi.setColumnsVisible).toHaveBeenCalledWith(
        ['answers'],
        true
      );
    });

    test('should hide answers column when no detailed reason', () => {
      component['_data'] = [
        { detailedReasonId: undefined },
        { detailedReasonId: undefined },
      ] as ReasonForLeavingRank[];
      component.gridApi = {
        setColumnsVisible: jest.fn(),
      } as unknown as GridApi;

      component.showOrHideAnswersColumn();

      expect(component.gridApi.setColumnsVisible).toHaveBeenCalledWith(
        ['answers'],
        false
      );
    });
  });

  describe('createExcelFileName', () => {
    test('should return excel file name', () => {
      component.filters = {
        filterDimension: FilterDimension.FUNCTION,
        value: 'some value',
        timeRange: '123-321',
      };
      const filters = {
        reason: 'some reason',
        detailedReason: 'some detailed reason',
      } as EmployeeListDialogMetaFilters;

      const result = component.createExcelFileName('Leavers', filters);

      expect(result).toEqual(
        'Leavers some value 123-321 some reason - some detailed reason'
      );
    });

    test('should return excel file name when no deailed reason', () => {
      component.filters = {
        filterDimension: FilterDimension.FUNCTION,
        value: 'some value',
        timeRange: '123-321',
      };
      const filters = {
        reason: 'some reason',
      } as EmployeeListDialogMetaFilters;

      const result = component.createExcelFileName('Leavers', filters);

      expect(result).toEqual('Leavers some value 123-321 some reason');
    });
  });
});
