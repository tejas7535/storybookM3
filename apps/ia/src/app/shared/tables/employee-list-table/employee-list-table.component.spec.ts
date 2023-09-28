import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

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
      ];

      const columnDefs = component.createColDefs();

      expect(columnDefs.length).toEqual(7);
      expect(columnDefs.map((col) => col.field)).toEqual(expectedColumnFields);
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
      ];

      const columnDefs = component.createColDefs();

      expect(columnDefs.length).toEqual(7);
      expect(columnDefs.map((col) => col.field)).toEqual(expectedColumnFields);
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
      ];

      const columnDefs = component.createColDefs();

      expect(columnDefs.length).toEqual(6);
      expect(columnDefs.map((col) => col.field)).toEqual(expectedColumnFields);
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
      ];

      const columnDefs = component.createColDefs();

      expect(columnDefs.length).toEqual(7);
      expect(columnDefs.map((col) => col.field)).toEqual(expectedColumnFields);
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
});
