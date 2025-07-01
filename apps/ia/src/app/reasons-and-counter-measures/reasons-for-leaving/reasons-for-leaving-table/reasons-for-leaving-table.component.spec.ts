import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import {
  CellClickedEvent,
  GetRowIdParams,
  GridApi,
  IsFullWidthRowParams,
  ValueGetterParams,
} from 'ag-grid-community';

import { EmployeeListDialogComponent } from '../../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
  EmployeeListDialogMetaHeadings,
} from '../../../shared/dialogs/employee-list-dialog/models';
import { EmployeeWithAction, FilterDimension } from '../../../shared/models';
import { AnalysisData, ReasonForLeavingRank } from '../../models';
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

  describe('getRowId', () => {
    test('should return row id when reason', () => {
      const params = { data: { reasonId: 123 } } as GetRowIdParams<
        ReasonForLeavingRank | AnalysisData,
        string
      >;
      const result = component.getRowId(params);

      expect(result).toEqual('reason-123');
    });

    test('should return row id when analysis', () => {
      const params = {
        data: { reasonId: 123, show: true, fullWidth: true },
      } as GetRowIdParams<ReasonForLeavingRank | AnalysisData, string>;
      const result = component.getRowId(params);

      expect(result).toEqual('analysis-123');
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
      } as ValueGetterParams<ReasonForLeavingRank | AnalysisData, string>;
      const result = component.getPercentageValueGetter(params);

      expect(result).toEqual('12.3');
    });
  });

  describe('getLeaversValueGetter', () => {
    test('should return count and restrictedAccess if detailed reason undefined', () => {
      const params = {
        data: { detailedReasonId: undefined, leavers: 123 },
      } as ValueGetterParams<ReasonForLeavingRank | AnalysisData, string>;
      const result = component.getLeaversValueGetter(params);

      expect(result).toEqual({ count: 123, restrictedAccess: false });
    });

    test('should return undefined if detailed reason defined', () => {
      const params = {
        data: { detailedReasonId: 12, leavers: 123 },
      } as ValueGetterParams<ReasonForLeavingRank | AnalysisData, string>;
      const result = component.getLeaversValueGetter(params);

      expect(result).toBeUndefined();
    });
  });

  describe('getAnswersValueGetter', () => {
    test('should return count and restrictedAccess if detailed reason defined', () => {
      const params = {
        data: { detailedReasonId: 12, leavers: 123 },
      } as ValueGetterParams<ReasonForLeavingRank | AnalysisData, string>;
      const result = component.getAnswersValueGetter(params);

      expect(result).toEqual({ count: 123, restrictedAccess: false });
    });

    test('should return undefined if detailed reason undefined', () => {
      const params = {
        data: { detailedReasonId: undefined, leavers: 123 },
      } as ValueGetterParams<ReasonForLeavingRank | AnalysisData, string>;
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

  describe('isFullWidthRowRenderer', () => {
    test('should return true', () => {
      const result = component.isFullWidthRowRenderer({
        rowNode: {
          data: { fullWidth: true },
        },
      } as unknown as IsFullWidthRowParams<
        ReasonForLeavingRank | AnalysisData
      >);
      expect(result).toBeTruthy();
    });

    test('should return false', () => {
      const result = component.isFullWidthRowRenderer({
        rowNode: {
          data: {},
        },
      } as unknown as IsFullWidthRowParams<
        ReasonForLeavingRank | AnalysisData
      >);
      expect(result).toBeFalsy();
    });
  });

  describe('onCellClicked', () => {
    beforeEach(() => {
      component.toggleReasonAnalysis.emit = jest.fn();
      component.gridApi = {
        updateGridOptions: jest.fn(),
      } as unknown as GridApi;
      component.showOrHideAnswersColumn = jest.fn();
    });

    test('should do nothing when full width row clicked', () => {
      const event = {
        data: { fullWidth: true },
        column: {
          getColId: () => 'someColumn',
        },
      } as unknown as CellClickedEvent<ReasonForLeavingRank | AnalysisData>;

      component.onCellClicked(event);

      expect(component.toggleReasonAnalysis.emit).not.toHaveBeenCalled();
      expect(component.gridApi.updateGridOptions).not.toHaveBeenCalled();
    });

    test('should do nothing when leavers column clicked', () => {
      const event = {
        data: { fullWidth: true },
        column: {
          getColId: () => 'leavers',
        },
      } as unknown as CellClickedEvent<ReasonForLeavingRank | AnalysisData>;

      component.onCellClicked(event);

      expect(component.toggleReasonAnalysis.emit).not.toHaveBeenCalled();
      expect(component.gridApi.updateGridOptions).not.toHaveBeenCalled();
    });

    test('should emit toggleReasonAnalysis', () => {
      const data = { reasonId: 123 } as ReasonForLeavingRank;
      component.data = [
        data,
        { reasonId: 123, fullWidth: true } as AnalysisData,
      ];
      const event = {
        data,
        rowIndex: 0,
        column: {
          getColId: () => 'someColumn',
        },
      } as unknown as CellClickedEvent<ReasonForLeavingRank | AnalysisData>;

      component.onCellClicked(event);

      expect(component.toggleReasonAnalysis.emit).toHaveBeenCalledWith(123);
      expect(component.gridApi.updateGridOptions).toHaveBeenCalledWith({
        rowData: component.data,
      });
    });
  });
});
