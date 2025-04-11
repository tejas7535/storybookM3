import { signal } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';

import {
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-enterprise';

import * as FormatFilters from '../../../../../shared/ag-grid/grid-filter-model';
import { Stub } from '../../../../../shared/test/stub.class';
import * as Helper from '../../column-definition';
import { ColumnLayoutManagementModalComponent } from '../column-layout-management-modal/column-layout-management-modal.component';
import { ExportTableDialogComponent } from '../export-table-dialog/export-table-dialog.component';
import { GlobalSelectionUtils } from './../../../../../feature/global-selection/global-selection.utils';
import { MaterialCustomerTableComponent } from './material-customer-table.component';

describe('MaterialCustomerTableComponent', () => {
  let component: MaterialCustomerTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MaterialCustomerTableComponent>({
      component: MaterialCustomerTableComponent,
      providers: [
        Stub.getMaterialCustomerServiceProvider(),
        Stub.getMaterialCustomerTableServiceProvider(),
        Stub.getMatDialogProvider(),
      ],
    });

    component['gridApi'] = Stub.getGridApi();

    Stub.setInput('selectionFilter', {});

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let getCriteriaDataSpy: jest.SpyInstance;
    let getDataFetchedEventSpy: jest.SpyInstance;

    beforeEach(() => {
      getCriteriaDataSpy = jest
        .spyOn(component['materialCustomerService'], 'getCriteriaData')
        .mockReturnValue(of({ sortableFields: ['testField'] } as any));
      getDataFetchedEventSpy = jest
        .spyOn(component['materialCustomerTableService'], 'getDataFetchedEvent')
        .mockReturnValue(of({ totalRowCount: 100 }));
      jest
        .spyOn(component as any, 'defaultColDef')
        .mockImplementation(() => {});
    });

    it('should fetch criteria data and initialize default column definitions', () => {
      component.ngOnInit();

      expect(getCriteriaDataSpy).toHaveBeenCalled();
      expect(component.criteriaData).toEqual({ sortableFields: ['testField'] });
      expect(component['defaultColDef']).toHaveBeenCalled();
    });

    it('should subscribe to data fetched event and update totalRowCount', () => {
      const setSpy = jest.spyOn(component.totalRowCount, 'set');

      component.ngOnInit();

      expect(getDataFetchedEventSpy).toHaveBeenCalled();
      expect(setSpy).toHaveBeenCalledWith(100);
    });
  });

  describe('defaultColDef', () => {
    let setGridOptionSpy: jest.SpyInstance;
    let columnDefinitionsSpy: jest.SpyInstance;

    beforeEach(() => {
      setGridOptionSpy = jest.spyOn(component.gridApi, 'setGridOption');
      setGridOptionSpy.mockClear();
      columnDefinitionsSpy = jest
        .spyOn(Helper, 'columnDefinitions')
        .mockReturnValue([
          {
            colId: 'testCol',
            alwaysVisible: true,
            visible: true,
            filter: 'mockFilter',
            filterParams: {},
            cellRenderer: 'mockRenderer',
            valueGetter: jest.fn(),
            valueFormatter: jest.fn(),
            floatingFilterComponent: 'mockFloatingFilter',
          },
        ]);
      columnDefinitionsSpy.mockClear();
      component['selectableOptionsService'].loading$ = new BehaviorSubject(
        false
      );
    });

    it('should initialize column definitions with correct structure', () => {
      component['defaultColDef']();

      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'columnDefs',
        expect.arrayContaining([
          expect.objectContaining({
            key: 'testCol',
            colId: 'testCol',
            field: 'testCol',
            headerName: 'material_customer.column.testCol',
            tooltipField: 'testCol',
            floatingFilterComponent: 'mockFloatingFilter',
            cellRenderer: 'mockRenderer',
          }),
        ])
      );
    });

    it('should call columnDefinitions with correct services', () => {
      component['defaultColDef']();

      expect(columnDefinitionsSpy).toHaveBeenCalledWith(
        component['agGridLocalizationService'],
        component['selectableOptionsService']
      );
    });

    it('should set initialColumns if not already set', () => {
      component.initialColumns = null;

      component['defaultColDef']();

      expect(component.initialColumns).toEqual([
        {
          colId: 'testCol',
          alwaysVisible: true,
          visible: true,
          filter: 'mockFilter',
          filterParams: {},
          cellRenderer: 'mockRenderer',
          valueGetter: expect.any(Function),
          valueFormatter: expect.any(Function),
          floatingFilterComponent: 'mockFloatingFilter',
        },
      ]);
    });

    it('should not overwrite initialColumns if already set', () => {
      component.initialColumns = [{ colId: 'existingCol' }];

      component['defaultColDef']();

      expect(component.initialColumns).toEqual([{ colId: 'existingCol' }]);
    });

    it('should not set column definitions if loading is true', () => {
      component['selectableOptionsService'].loading$.next(true);

      component['defaultColDef']();

      expect(setGridOptionSpy).not.toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    let setFilterModelSpy: jest.SpyInstance;
    let addEventListenerSpy: jest.SpyInstance;
    let useMaterialCustomerColumnLayoutsSpy: jest.SpyInstance;

    beforeEach(() => {
      setFilterModelSpy = jest.spyOn(component.gridApi, 'setFilterModel');
      addEventListenerSpy = jest.spyOn(component.gridApi, 'addEventListener');
      useMaterialCustomerColumnLayoutsSpy = jest
        .spyOn(
          component['materialCustomerTableService'],
          'useMaterialCustomerColumnLayouts'
        )
        .mockReturnValue({
          resetLayout: jest.fn(),
          loadLayout: jest.fn(),
          saveLayout: jest.fn(),
        });
      jest
        .spyOn(component as any, 'defaultColDef')
        .mockImplementation(() => {});
      jest
        .spyOn(component as any, 'setDataSource')
        .mockImplementation(() => {});
    });

    it('should set gridApi and initialize layout methods', () => {
      const mockEvent = { api: component.gridApi } as GridReadyEvent;

      component['onGridReady'](mockEvent);

      expect(component.gridApi).toBe(mockEvent.api);
      expect(useMaterialCustomerColumnLayoutsSpy).toHaveBeenCalledWith(
        component.gridApi
      );
      expect(component.resetLayout).toBeDefined();
      expect(component.loadLayout).toBeDefined();
      expect(component.saveLayout).toBeDefined();
    });

    it('should call defaultColDef and setDataSource', () => {
      const mockEvent = { api: component.gridApi } as GridReadyEvent;

      component['onGridReady'](mockEvent);

      expect(component['defaultColDef']).toHaveBeenCalled();
      expect(component['setDataSource']).toHaveBeenCalledWith(
        component.selectionFilter()
      );
    });

    it('should add columnEverythingChanged event listener', () => {
      const mockEvent = { api: component.gridApi } as GridReadyEvent;
      const mockFilter: any = null;
      component.filter = mockFilter;

      component['onGridReady'](mockEvent);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'columnEverythingChanged',
        expect.any(Function)
      );

      // Simulate the event listener call
      const listener = addEventListenerSpy.mock.calls[0][1];
      listener();

      expect(setFilterModelSpy).toHaveBeenCalledWith(
        FormatFilters.formatFilterModelForAgGrid(mockFilter)
      );
    });

    it('should call defaultColDef twice', () => {
      const mockEvent = { api: component.gridApi } as GridReadyEvent;

      component['onGridReady'](mockEvent);

      expect(component['defaultColDef']).toHaveBeenCalledTimes(2);
    });
  });

  describe('setDataSource', () => {
    let setFilterModelSpy: jest.SpyInstance;
    let setGridOptionSpy: jest.SpyInstance;
    let createEmptyDatasourceSpy: jest.SpyInstance;
    let createMaterialCustomerDatasourceSpy: jest.SpyInstance;

    beforeEach(() => {
      setFilterModelSpy = jest.spyOn(component.gridApi, 'setFilterModel');
      setGridOptionSpy = jest.spyOn(component.gridApi, 'setGridOption');
      createEmptyDatasourceSpy = jest
        .spyOn(
          component['materialCustomerTableService'],
          'createEmptyDatasource'
        )
        .mockReturnValue('emptyDatasource' as any);
      createMaterialCustomerDatasourceSpy = jest
        .spyOn(
          component['materialCustomerTableService'],
          'createMaterialCustomerDatasource'
        )
        .mockReturnValue('materialCustomerDatasource' as any);
      jest
        .spyOn(GlobalSelectionUtils, 'globalSelectionCriteriaToFilter')
        .mockReturnValue('mockFilter' as any);
    });

    it('should set an empty datasource if global selection state is empty', () => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);

      component['setDataSource']();

      expect(setFilterModelSpy).toHaveBeenCalledWith(null);
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'serverSideDatasource',
        'emptyDatasource'
      );
      expect(createEmptyDatasourceSpy).toHaveBeenCalled();
      expect(createMaterialCustomerDatasourceSpy).not.toHaveBeenCalled();
    });

    it('should set a material customer datasource if global selection state is not empty', () => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(false);

      component['setDataSource']({} as any);

      expect(setFilterModelSpy).not.toHaveBeenCalled();
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'serverSideDatasource',
        'materialCustomerDatasource'
      );
      expect(createMaterialCustomerDatasourceSpy).toHaveBeenCalledWith(
        'mockFilter',
        []
      );
      expect(createEmptyDatasourceSpy).not.toHaveBeenCalled();
    });

    it('should call globalSelectionCriteriaToFilter with the provided global selection', () => {
      const globalSelection = { test: 'value' } as any;

      component['setDataSource'](globalSelection);

      expect(
        GlobalSelectionUtils.globalSelectionCriteriaToFilter
      ).toHaveBeenCalledWith(globalSelection);
    });
  });

  describe('onFilterChange', () => {
    let formatFilterModelForBackendSpy: jest.SpyInstance;
    let emitSpy: jest.SpyInstance;

    beforeEach(() => {
      formatFilterModelForBackendSpy = jest.spyOn(
        FormatFilters,
        'formatFilterModelForBackend'
      );
      emitSpy = jest.spyOn(component.onColumnFilterChange, 'emit');
    });

    it('should format the filter model and emit the filter', () => {
      const mockEvent = {
        api: {
          getFilterModel: jest.fn().mockReturnValue({ testFilter: 'value' }),
        },
      } as unknown as FilterChangedEvent;

      formatFilterModelForBackendSpy.mockReturnValue({
        formattedFilter: 'value',
      });

      component['onFilterChange'](mockEvent);

      expect(mockEvent.api.getFilterModel).toHaveBeenCalled();
      expect(formatFilterModelForBackendSpy).toHaveBeenCalledWith({
        testFilter: 'value',
      });
      expect(component.filter).toEqual({ formattedFilter: 'value' });
      expect(emitSpy).toHaveBeenCalledWith({ formattedFilter: 'value' });
    });

    it('should handle an empty filter model', () => {
      const mockEvent = {
        api: {
          getFilterModel: jest.fn().mockReturnValue(null),
        },
      } as unknown as FilterChangedEvent;

      formatFilterModelForBackendSpy.mockReturnValue(null);

      component['onFilterChange'](mockEvent);

      expect(mockEvent.api.getFilterModel).toHaveBeenCalled();
      expect(formatFilterModelForBackendSpy).toHaveBeenCalledWith(null);
      expect(component.filter).toBeNull();
      expect(emitSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('getVisibilityBackground', () => {
    it('should return the correct background and color when portfolioStatus is "IA"', () => {
      const params = {
        data: { portfolioStatus: 'IA' },
      };

      const result = component['getVisibilityBackground'](params);

      expect(result).toEqual({
        backgroundColor: '#F6F7F9',
        color: '#646464',
      });
    });

    it('should return undefined when portfolioStatus is not "IA"', () => {
      const params = {
        data: { portfolioStatus: 'OTHER' },
      };

      const result = component['getVisibilityBackground'](params);

      expect(result).toBeUndefined();
    });

    it('should return undefined when data is undefined', () => {
      const params = {
        data: undefined,
      } as any;

      const result = component['getVisibilityBackground'](params);

      expect(result).toBeUndefined();
    });
  });

  describe('getIdForRow', () => {
    it('should return row.id if it is defined', () => {
      const row = { id: 'rowId', data: { id: 'dataId' } };

      const result = component['getIdForRow'](row);

      expect(result).toBe('rowId');
    });

    it('should return row.data.id if row.id is undefined', () => {
      const row = { id: undefined, data: { id: 'dataId' } } as any;

      const result = component['getIdForRow'](row);

      expect(result).toBe('dataId');
    });

    it('should throw an error if both row.id and row.data.id are undefined', () => {
      const row = { id: undefined, data: { id: undefined } } as any;

      expect(() => component['getIdForRow'](row)).toThrow(
        'Could not find id in row.'
      );
    });
  });

  describe('onFirstDataRendered', () => {
    it('should call autoSizeAllColumns on the grid API', () => {
      const mockEvent = {
        api: {
          autoSizeAllColumns: jest.fn(),
        },
      } as unknown as FirstDataRenderedEvent;

      component['onFirstDataRendered'](mockEvent);

      expect(mockEvent.api.autoSizeAllColumns).toHaveBeenCalled();
    });
  });

  describe('openColumnLayoutManagementModal', () => {
    let openDialogSpy: jest.SpyInstance;

    beforeEach(() => {
      openDialogSpy = jest.spyOn(component['dialog'], 'open');
    });

    it('should open the ColumnLayoutManagementModalComponent with correct data and position', () => {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: jest.fn().mockReturnValue({
            top: 100,
            left: 200,
          }),
        },
      } as unknown as MouseEvent;

      component['resetLayout'] = jest.fn();
      component['saveLayout'] = jest.fn();
      component['loadLayout'] = jest.fn();

      component['openColumnLayoutManagementModal'](mockEvent);

      expect(
        (mockEvent.currentTarget as any).getBoundingClientRect
      ).toHaveBeenCalled();
      expect(openDialogSpy).toHaveBeenCalledWith(
        ColumnLayoutManagementModalComponent,
        {
          data: {
            resetLayout: component['resetLayout'],
            saveLayout: component['saveLayout'],
            loadLayout: component['loadLayout'],
          },
          position: {
            top: '130px',
            left: '-80px',
          },
        }
      );
    });

    it('should handle missing currentTarget gracefully', () => {
      const mockEvent = {} as MouseEvent;

      expect(() =>
        component['openColumnLayoutManagementModal'](mockEvent)
      ).not.toThrow();
      expect(openDialogSpy).not.toHaveBeenCalled();
    });
  });

  describe('isExportDisabled', () => {
    it('should return true if globalSelectionStateService is empty', () => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);

      const result = component['isExportDisabled']();

      expect(result).toBe(true);
    });

    it('should return false if globalSelectionStateService is not empty', () => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(false);

      const result = component['isExportDisabled']();

      expect(result).toBe(false);
    });
  });

  describe('openExport', () => {
    let openDialogSpy: jest.SpyInstance;

    beforeEach(() => {
      openDialogSpy = jest.spyOn(component['dialog'], 'open');
      jest
        .spyOn(GlobalSelectionUtils, 'globalSelectionCriteriaToFilter')
        .mockReturnValue('mockFilter' as any);
    });

    it('should open the ExportTableDialogComponent with correct data', () => {
      component.gridApi = { test: 'gridApi' } as unknown as GridApi;

      component['openExport']();

      expect(openDialogSpy).toHaveBeenCalledWith(ExportTableDialogComponent, {
        data: {
          gridApi: component.gridApi,
          filter: 'mockFilter',
          backdrop: false,
        },
      });
    });

    it('should call globalSelectionCriteriaToFilter with the correct selection filter', () => {
      const selectionFilter = { test: 'selectionFilter' } as any;
      (component as any).selectionFilter = signal(selectionFilter);

      component['openExport']();

      expect(
        GlobalSelectionUtils.globalSelectionCriteriaToFilter
      ).toHaveBeenCalledWith(selectionFilter);
    });
  });
});
