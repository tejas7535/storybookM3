import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import {
  Column,
  GridApi,
  IRowNode,
  ProcessCellForExportParams,
} from 'ag-grid-community';
import { MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_SAPID,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MaterialClass,
  NavigationLevel,
  RELEASE_DATE,
} from '@mac/feature/materials-supplier-database/constants';
import {
  MsdAgGridReadyService,
  MsdDialogService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import { RawMaterialControlPanelComponent } from './raw-material-control-panel.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../../util', () => ({
  getStatus: jest.fn(),
}));

describe('RawMaterialControlPanelComponent', () => {
  let component: RawMaterialControlPanelComponent;
  let spectator: Spectator<RawMaterialControlPanelComponent>;
  const gridApiMock = {
    setFilterModel: jest.fn(),
    onFilterChanged: jest.fn(),
    getSelectedNodes: jest.fn(),
    exportDataAsExcel: jest.fn(),
    setGridOption: jest.fn(),
    getGridOption: jest.fn(),
  } as unknown as GridApi;
  const navigationMock = new Subject();

  const createComponent = createComponentFactory({
    component: RawMaterialControlPanelComponent,
    imports: [
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      MockProvider(
        DataFacade,
        {
          agGridFilter$: of(),
          navigation$: navigationMock,
          hasEditorRole$: of(true),
          isBulkEditAllowed$: of(true),
          hasMinimizedDialog$: of(true),
          resultCount$: of(true),
        },
        'useValue'
      ),
      MockProvider(
        MsdAgGridReadyService,
        {
          agGridApi$: of({ gridApi: gridApiMock }),
        },
        'useValue'
      ),
      MockProvider(DatePipe),
      MockProvider(
        ApplicationInsightsService,
        {
          logEvent: jest.fn(),
        },
        'useValue'
      ),
      MockProvider(MsdDialogService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    navigationMock.next({
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set hasEditorRole', () => {
      expect(component.hasEditorRole).toBe(true);
    });
    it('should be editable', () => {
      expect(component.isEditable).toBe(true);
    });
    it('should not be editable after material swap', () => {
      navigationMock.next({
        materialClass: MaterialClass.POLYMER,
        navigationLevel: NavigationLevel.MATERIAL,
      });
      expect(component.isEditable).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the observable', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('Dialog service', () => {
    it('should resume dialog', () => {
      component['dialogService'].openDialog = jest.fn();
      component.resumeDialog();
      expect(component['dialogService'].openDialog).toHaveBeenCalledWith(true);
    });
    it('should open dialog', () => {
      component['dialogService'].openDialog = jest.fn();
      component.openDialog(false);
      expect(component['dialogService'].openDialog).toHaveBeenCalledWith(false);
    });

    it('should open multiEdit dialog', () => {
      component['dialogService'].openBulkEditDialog = jest.fn();
      component.openDialogMultiEdit();
      expect(component['dialogService'].openBulkEditDialog).toHaveBeenCalled();
    });
  });

  describe('countSelectedNodes', () => {
    it('should return the number of selected nodes', () => {
      const item = {} as IRowNode;
      gridApiMock.getSelectedNodes = jest.fn(() => [item, item, item]);
      expect(component.countSelectedNodes()).toBe(3);
    });
  });

  describe('reload', () => {
    it('should refetch data', () => {
      component['dataFacade'].fetchResult = jest.fn();
      component.reload();
      expect(component['dataFacade'].fetchResult).toHaveBeenCalled();
    });
  });

  describe('export', () => {
    beforeEach(() => {
      component['agGridApi'].setGridOption = jest.fn();
    });
    it('should call export function with current timestamp', () => {
      component['getVisibleColumns'] = jest.fn(() => [
        ...component['NON_EXCEL_COLUMNS'],
        MANUFACTURER_SUPPLIER_SAPID,
      ]);
      component['datePipe'].transform = jest.fn().mockReturnValue('1234-13-44');
      component['expandSupplierIds'] = jest.fn();

      component.export();

      expect(component['datePipe'].transform).toHaveBeenCalled();
      expect(component['agGridApi'].setGridOption).toHaveBeenCalledTimes(2);
      expect(component['agGridApi'].exportDataAsExcel).toHaveBeenCalledWith({
        author: 'materialsSupplierDatabase.mainTable.excelExport.author',
        fileName:
          '1234-13-44materialsSupplierDatabase.mainTable.excelExport.fileNameSuffix',
        sheetName: 'materialsSupplierDatabase.mainTable.excelExport.sheetName',
        columnKeys: [MANUFACTURER_SUPPLIER_SAPID],
        processCellCallback: expect.any(Function),
      });
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith('[MAC - MSD] Export Excel');
    });

    it('should call export function with current timestamp without splitting fkts', () => {
      component['getVisibleColumns'] = jest.fn(() => [
        MATERIAL_STANDARD_MATERIAL_NAME,
      ]);
      component['datePipe'].transform = jest.fn().mockReturnValue('1234-13-44');
      component['expandSupplierIds'] = jest.fn();

      component.export();

      expect(component['datePipe'].transform).toHaveBeenCalled();
      expect(component['agGridApi'].setGridOption).not.toHaveBeenCalled();
      expect(component['agGridApi'].exportDataAsExcel).toHaveBeenCalledWith({
        author: 'materialsSupplierDatabase.mainTable.excelExport.author',
        fileName:
          '1234-13-44materialsSupplierDatabase.mainTable.excelExport.fileNameSuffix',
        sheetName: 'materialsSupplierDatabase.mainTable.excelExport.sheetName',
        columnKeys: [MATERIAL_STANDARD_MATERIAL_NAME],
        processCellCallback: expect.any(Function),
      });
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith('[MAC - MSD] Export Excel');
    });
  });

  describe('getFormattedCellValue', () => {
    it.each([
      [RELEASE_DATE, 'any', undefined, 'formated'],
      [RELEASE_DATE, undefined, undefined, ''],

      [LAST_MODIFIED, 'any', undefined, 'formated'],
      [LAST_MODIFIED, 'any', true, 'formated'],
      [LAST_MODIFIED, 'any', false, 'any'],
    ])(
      'should for column [%p] with value [%p] use formatter: [%p] and return [%p]',
      (columnName, value, useValueFormatterForExport, expected) => {
        const params = {
          column: {
            getColId: jest.fn(() => columnName),
            getColDef: jest.fn(() => ({ useValueFormatterForExport })),
          } as unknown as Column,
          value,
          formatValue: jest.fn(() => 'formated'),
        } as unknown as ProcessCellForExportParams;

        expect(component['getFormattedCellValue'](params)).toEqual(expected);
      }
    );
  });

  describe('expandSupplierIds', () => {
    it('should split if multiple sap ids are present', () => {
      const input: any[] = [
        { [MANUFACTURER_SUPPLIER_SAPID]: [1, 2, 3], a: 1, b: 2 },
      ];

      const expected: any[] = [
        { [MANUFACTURER_SUPPLIER_SAPID]: [1], a: 1, b: 2 },
        { [MANUFACTURER_SUPPLIER_SAPID]: [2], a: 1, b: 2 },
        { [MANUFACTURER_SUPPLIER_SAPID]: [3], a: 1, b: 2 },
      ];

      expect(component['expandSupplierIds'](input)).toEqual(expected);
    });
    it('should not split if no sap id is present', () => {
      const input: any[] = [{ [MANUFACTURER_SUPPLIER_SAPID]: [], a: 1, b: 2 }];

      expect(component['expandSupplierIds'](input)).toEqual(input);
    });
    it('should not split if only one sap id is present', () => {
      const input: any[] = [{ [MANUFACTURER_SUPPLIER_SAPID]: [1], a: 1, b: 2 }];

      expect(component['expandSupplierIds'](input)).toEqual(input);
    });
    it('should not split if column is missing', () => {
      const input: any[] = [{ a: 1, b: 2 }];

      expect(component['expandSupplierIds'](input)).toEqual(input);
    });
  });
});
