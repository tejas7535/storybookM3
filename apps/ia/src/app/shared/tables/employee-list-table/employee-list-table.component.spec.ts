import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  ProcessCellForExportParams,
  ValueGetterParams,
} from 'ag-grid-community';

import { ActionType, LeavingType } from '../../models';
import { SharedModule } from '../../shared.module';
import { EmployeeListTableComponent } from './employee-list-table.component';
import { FluctuationType } from './models';

describe('EmployeeListTableComponent', () => {
  let component: EmployeeListTableComponent;
  let spectator: Spectator<EmployeeListTableComponent>;

  const createComponent = createComponentFactory({
    component: EmployeeListTableComponent,
    detectChanges: false,
    imports: [SharedModule, AgGridModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set column definitions', () => {
      const columnsMock: ColDef[] = [{ field: 'a' }];
      component.createColDefs = jest.fn().mockReturnValue(columnsMock);

      component.ngOnInit();

      expect(component.columnDefs).toEqual(columnsMock);
      expect(component.createColDefs).toHaveBeenCalled();
    });
  });

  describe('createColDefs', () => {
    test('should create columns for leavers type', () => {
      component.type = 'leavers';
      const expectedColumnFields = [
        'employeeName',
        'userId',
        'employeeKey',
        'orgUnit',
        'positionDescription',
        'exitDate',
        'reasonForLeaving',
        'actionReason',
        'from',
        'to',
      ];

      const columnDefs = component.createColDefs();

      expect(columnDefs.length).toEqual(10);
      expect(columnDefs.map((col) => col.field)).toEqual(expectedColumnFields);
      expect(columnDefs.find((col) => col.field === 'from')).toBeTruthy();
      expect(columnDefs.find((col) => col.field === 'to')).toBeTruthy();
    });

    test('should create columns for leavers type with reason for leaving', () => {
      component.type = 'leavers';
      const expectedColumnFields = [
        'employeeName',
        'userId',
        'employeeKey',
        'orgUnit',
        'positionDescription',
        'exitDate',
        'reasonForLeaving',
        'actionReason',
        'from',
        'to',
      ];

      const columnDefs = component.createColDefs();

      expect(columnDefs.length).toEqual(10);
      expect(columnDefs.map((col) => col.field)).toEqual(expectedColumnFields);
      expect(columnDefs.find((col) => col.field === 'from')).toBeTruthy();
      expect(columnDefs.find((col) => col.field === 'to')).toBeTruthy();
    });

    test('should create columns for new joiners', () => {
      component.type = 'newJoiners';
      component.excludedColumns = ['reasonForLeaving'];
      const expectedColumnFields = [
        'employeeName',
        'userId',
        'employeeKey',
        'orgUnit',
        'positionDescription',
        'entryDate',
        'from',
        'to',
      ];

      const columnDefs = component.createColDefs();

      expect(columnDefs.length).toEqual(8);
      expect(columnDefs.map((col) => col.field)).toEqual(expectedColumnFields);
      expect(columnDefs.find((col) => col.field === 'from')).toBeTruthy();
      expect(columnDefs.find((col) => col.field === 'to')).toBeTruthy();
    });

    test('should create columns for new joiners with reason for leaving', () => {
      component.type = 'newJoiners';
      const expectedColumnFields = [
        'employeeName',
        'userId',
        'employeeKey',
        'orgUnit',
        'positionDescription',
        'entryDate',
        'reasonForLeaving',
        'from',
        'to',
      ];

      const columnDefs = component.createColDefs();

      expect(columnDefs.length).toEqual(9);
      expect(columnDefs.map((col) => col.field)).toEqual(expectedColumnFields);
      expect(columnDefs.find((col) => col.field === 'from')).toBeTruthy();
      expect(columnDefs.find((col) => col.field === 'to')).toBeTruthy();
    });
  });

  describe('mapLeavingTypeToFluctuationType', () => {
    test('should map forced leaving type', () => {
      const toMap = LeavingType.FORCED;

      const result = component.mapLeavingTypeToFluctuationType(toMap);

      expect(result).toEqual(FluctuationType.FORCED);
    });

    test('should map unforced leaving type', () => {
      const toMap = LeavingType.UNFORCED;

      const result = component.mapLeavingTypeToFluctuationType(toMap);

      expect(result).toEqual(FluctuationType.UNFORCED);
    });

    test('should map remaining leaving type', () => {
      const toMap = LeavingType.REMAINING;

      const result = component.mapLeavingTypeToFluctuationType(toMap);

      expect(result).toEqual(FluctuationType.REMAINING);
    });

    test('should map internal action type', () => {
      const toMap = ActionType.INTERNAL;

      const result = component.mapLeavingTypeToFluctuationType(toMap);

      expect(result).toEqual(FluctuationType.INTERNAL);
    });

    test('should return undefined when external action type', () => {
      const toMap = ActionType.EXTERNAL;

      const result = component.mapLeavingTypeToFluctuationType(toMap);

      expect(result).toBeUndefined();
    });
  });

  describe('internalValueGetter', () => {
    test('should return from as current dimension value (leavers)', () => {
      const params: ValueGetterParams = {
        data: {
          exitDate: '123',
          currentDimensionValue: 'ABC',
          actionType: ActionType.INTERNAL,
        },
      } as any;

      const result = component.internalValueGetter(params, 'from');

      expect(result).toEqual('ABC');
    });

    test('should return from as previous dimension value (leavers)', () => {
      const params: ValueGetterParams = {
        data: {
          exitDate: '123',
          nextDimensionValue: 'ABC',
          actionType: ActionType.INTERNAL,
        },
      } as any;

      const result = component.internalValueGetter(params, 'to');

      expect(result).toEqual('ABC');
    });

    test('should return from as previous dimension value (new joiners)', () => {
      const params: ValueGetterParams = {
        data: {
          entryDate: '123',
          previousDimensionValue: 'ABC',
          actionType: ActionType.INTERNAL,
        },
      } as any;

      const result = component.internalValueGetter(params, 'from');

      expect(result).toEqual('ABC');
    });

    test('should return to as current dimension value (new joiners)', () => {
      const params: ValueGetterParams = {
        data: {
          entryDate: '123',
          currentDimensionValue: 'ABC',
          actionType: ActionType.INTERNAL,
        },
      } as any;

      const result = component.internalValueGetter(params, 'to');

      expect(result).toEqual('ABC');
    });
  });

  describe('getFormattedValue', () => {
    test('should use value formatter when defined', () => {
      const params: ProcessCellForExportParams = {
        column: {
          getColDef: () => ({
            valueFormatter: () => 'formatted',
          }),
        },
        node: {
          data: {},
        },
      } as any;

      const result = component.getFormattedValue(params);

      expect(result).toEqual('formatted');
    });

    test('should return value when formatter not defined', () => {
      const params: ProcessCellForExportParams = {
        value: 'value 11',
        column: {
          getColDef: () => ({}),
        },
      } as any;

      const result = component.getFormattedValue(params);

      expect(result).toEqual('value 11');
    });
  });
});
