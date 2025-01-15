import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import {
  Column,
  ExcelRow,
  GridApi,
  IRowNode,
  ProcessCellForExportParams,
  ProcessRowGroupForExportParams,
} from 'ag-grid-community';
import { MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  LAST_MODIFIED,
  MANUFACTURER_SUPPLIER_SAPID,
  MaterialClass,
  NavigationLevel,
  RELEASE_DATE,
  RELEASED_STATUS,
  Status,
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

  describe('exportExcelRawMaterials', () => {
    it('should call export function with current timestamp', () => {
      component['datePipe'].transform = jest.fn().mockReturnValue('1234-13-44');
      component['agGridApi'] = {} as unknown as GridApi;
      component['agGridApi'].exportDataAsExcel = jest.fn();

      const mockArrayFn = () => [] as ExcelRow[];
      const mockStringFn = () => '';

      component['splitRowsForMultipleSapIdsInExportFactory'] = jest.fn(
        () => mockArrayFn
      );
      component['excelExportRawProcessCellCallbackFactory'] = jest.fn(
        () => mockStringFn
      );

      component['getVisibleColumns'] = jest.fn(() => [
        MANUFACTURER_SUPPLIER_SAPID,
      ]);

      component.exportExcelRawMaterials();

      expect(component['datePipe'].transform).toHaveBeenCalledWith(
        expect.any(Date),
        'yyyy-MM-dd'
      );
      expect(component['agGridApi'].exportDataAsExcel).toHaveBeenCalledWith({
        author: 'materialsSupplierDatabase.mainTable.excelExport.author',
        fileName:
          '1234-13-44materialsSupplierDatabase.mainTable.excelExport.fileNameSuffix',
        sheetName: 'materialsSupplierDatabase.mainTable.excelExport.sheetName',
        columnKeys: [MANUFACTURER_SUPPLIER_SAPID],
        getCustomContentBelowRow: mockArrayFn,
        processCellCallback: mockStringFn,
      });
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith('[MAC - MSD] Export Excel');
    });

    it('should call export function with current timestamp without splitting fkts', () => {
      component['datePipe'].transform = jest.fn().mockReturnValue('1234-13-44');
      component['agGridApi'] = {} as unknown as GridApi;
      component['agGridApi'].exportDataAsExcel = jest.fn();

      component['getVisibleColumns'] = jest.fn((): string[] => []);

      component.exportExcelRawMaterials();

      expect(component['datePipe'].transform).toHaveBeenCalledWith(
        expect.any(Date),
        'yyyy-MM-dd'
      );
      expect(component['agGridApi'].exportDataAsExcel).toHaveBeenCalledWith({
        author: 'materialsSupplierDatabase.mainTable.excelExport.author',
        fileName:
          '1234-13-44materialsSupplierDatabase.mainTable.excelExport.fileNameSuffix',
        sheetName: 'materialsSupplierDatabase.mainTable.excelExport.sheetName',
        columnKeys: [],
        getCustomContentBelowRow: undefined,
        processCellCallback: undefined,
      });
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith('[MAC - MSD] Export Excel');
    });

    it('should do nothing if ag grid api is not defined', () => {
      component['agGridApi'] = undefined;
      component['datePipe'].transform = jest.fn();

      component.exportExcelRawMaterials();

      expect(component['datePipe'].transform).not.toHaveBeenCalled();
    });
  });

  describe('splitRowsForMultipleSapIdsInExportFactory', () => {
    let mockGetCellValue: () => string;
    let visibleColumns: string[];
    let mockSplitRowsForMultipleSapIdsInExport: (
      params: ProcessRowGroupForExportParams
    ) => ExcelRow[];

    beforeEach(() => {
      visibleColumns = [
        'col1',
        MANUFACTURER_SUPPLIER_SAPID,
        RELEASE_DATE,
        RELEASED_STATUS,
      ];
      mockGetCellValue = jest.fn(() => 'test');
      mockSplitRowsForMultipleSapIdsInExport = component[
        'splitRowsForMultipleSapIdsInExportFactory'
      ](mockGetCellValue, visibleColumns);
    });
    it('should return empty result if no sap ids are present', () => {
      const mockParams = {
        node: {
          data: {
            col1: 'a',
            col2: 'b',
            [MANUFACTURER_SUPPLIER_SAPID]: [],
          },
        } as unknown as IRowNode,
      } as ProcessRowGroupForExportParams;

      const result: ExcelRow[] =
        mockSplitRowsForMultipleSapIdsInExport(mockParams);

      expect(result).toEqual([]);
    });

    it('should return empty result if only one sap id is present', () => {
      const mockParams = {
        node: {
          data: {
            col1: 'a',
            col2: 'b',
            [MANUFACTURER_SUPPLIER_SAPID]: ['onlyOneId'],
          },
        } as unknown as IRowNode,
      } as ProcessRowGroupForExportParams;

      const result: ExcelRow[] =
        mockSplitRowsForMultipleSapIdsInExport(mockParams);

      expect(result).toEqual([]);
    });

    it('should return additional rows if more than one sap ids are present', () => {
      const mockParams = {
        node: {
          data: {
            col1: 'a',
            col2: 'b',
            [MANUFACTURER_SUPPLIER_SAPID]: ['id1', 'id2', 'id3'],
            releaseDateYear: 2000,
            releaseDateMonth: 1,
          },
        } as unknown as IRowNode,
      } as ProcessRowGroupForExportParams;
      const result: ExcelRow[] =
        mockSplitRowsForMultipleSapIdsInExport(mockParams);

      expect(result).toEqual([
        {
          cells: [
            { data: { type: 'String', value: 'test' } },
            { data: { type: 'String', value: 'test' } },
            { data: { type: 'String', value: 'test' } },
            { data: { type: 'String', value: 'test' } },
          ],
        },
        {
          cells: [
            { data: { type: 'String', value: 'test' } },
            { data: { type: 'String', value: 'test' } },
            { data: { type: 'String', value: 'test' } },
            { data: { type: 'String', value: 'test' } },
          ],
        },
      ]);
      expect(mockGetCellValue).toHaveBeenCalledWith('col1', 'a');
      expect(mockGetCellValue).not.toHaveBeenCalledWith('col2', 'b');
      expect(mockGetCellValue).toHaveBeenCalledWith(
        RELEASE_DATE,
        new Date(2000, 0)
      );
      expect(mockGetCellValue).toHaveBeenCalledWith(
        RELEASED_STATUS,
        'materialsSupplierDatabase.status.statusValues.undefined'
      );
      expect(mockGetCellValue).toHaveBeenCalledWith(
        MANUFACTURER_SUPPLIER_SAPID,
        'id2'
      );
      expect(mockGetCellValue).toHaveBeenCalledWith(
        MANUFACTURER_SUPPLIER_SAPID,
        'id3'
      );
    });
  });

  describe('excelExportRawProcessCellCallback', () => {
    let mockGetCellValue: () => string;
    let mockExcelExportProcessCellCallback: (
      params: ProcessCellForExportParams
    ) => string;

    beforeEach(() => {
      mockGetCellValue = jest.fn(() => 'test');
      mockExcelExportProcessCellCallback =
        component['excelExportRawProcessCellCallbackFactory'](mockGetCellValue);
    });

    it('should return the first sap id if multiple ids are present', () => {
      const mockParams = {
        column: {
          getColId: jest.fn(() => MANUFACTURER_SUPPLIER_SAPID),
        } as unknown as Column,
        node: {
          data: {
            [MANUFACTURER_SUPPLIER_SAPID]: ['id1', 'id2', 'id3'],
          },
        },
        value: ['id1-value', 'id2', 'id3'],
      } as ProcessCellForExportParams;

      const result: string = mockExcelExportProcessCellCallback(mockParams);

      expect(result).toEqual('test');
      expect(mockGetCellValue).toHaveBeenCalledWith(
        MANUFACTURER_SUPPLIER_SAPID,
        'id1'
      );
    });
  });

  describe('getCellValue', () => {
    it.each([
      [Status.BLOCKED.toString(), RELEASED_STATUS, Status.BLOCKED],
      [Status.DEFAULT.toString(), RELEASED_STATUS, undefined],
      ['02/01/1970', LAST_MODIFIED, 150_000],
      ['', LAST_MODIFIED, undefined],
      ['02/02/2008', RELEASE_DATE, new Date(2008, 1, 2)],
      ['', RELEASE_DATE, undefined],
      ['1', 'some col', 1],
      ['', 'some col', undefined],
    ])(
      'should return %p for column %p with value %p',
      (expected, columnName, value) => {
        const result = component['getCellValue'](columnName, value);

        expect(result).toEqual(expected);
      }
    );
  });
});
