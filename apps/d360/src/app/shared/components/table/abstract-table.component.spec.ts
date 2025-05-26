import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID } from '@angular/core';

import { BehaviorSubject, EMPTY, isEmpty, of, take } from 'rxjs';

import {
  FilterChangedEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SideBarDef,
} from 'ag-grid-enterprise';

import { sideBar } from '../../ag-grid/grid-defaults';
import { formatFilterModelForBackend } from '../../ag-grid/grid-filter-model';
import { applyColumnSettings } from '../../ag-grid/grid-utils';
import { Stub } from '../../test/stub.class';
import * as ErrorHelper from '../../utils/errors';
import { HttpError } from '../../utils/http-client';
import {
  messageFromSAP,
  SapErrorMessageHeader,
} from '../../utils/sap-localisation';
import { AbstractTableComponent } from './abstract-table.component';
import { IconType, TabAction, TableType } from './enums';
import {
  AllowedCallbacks,
  ColumnSetting,
  CustomTreeData,
  ServerSideAutoGroupProps,
  TableSetting,
} from './interfaces';
import { TableService } from './services';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

jest.mock('../../ag-grid/grid-utils', () => ({
  ...jest.requireActual('../../ag-grid/grid-utils'),
  applyColumnSettings: jest.fn(),
}));

jest.mock('../../ag-grid/grid-filter-model', () => ({
  formatFilterModelForBackend: jest.fn(),
}));

jest.mock('../../utils/sap-localisation', () => ({
  ...jest.requireActual('../../utils/sap-localisation'),
  messageFromSAP: jest.fn(),
}));

jest.mock('../../utils/errors', () => ({
  isProblemDetail: jest.fn(),
}));

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key: string) => key),
}));

@Component({
  selector: 'd360-test-table',
  template: '',
})
class TestTableComponent extends AbstractTableComponent {
  protected type = TableType.Backend;
  protected tableDefaultProps = {};
  protected init(): void {
    // Mock implementation
  }
}

describe('AbstractTableComponent', () => {
  let component: TestTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<TestTableComponent>({
      component: TestTableComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getTableServiceProvider(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    // Mock gridApi
    component['gridApi'] = Stub.getGridApi();

    jest.spyOn(component['gridApi'], 'getColumnDefs').mockReturnValue([]);

    Stub.setInput('config', {});
  });

  describe('tableId', () => {
    it('should return the tableId from the config', () => {
      Stub.setInput('config', {
        table: { tableId: 'testTableId' },
      });

      expect(component['tableId']).toBe('testTableId');
    });

    it('should throw an error if tableId is not defined in the config', () => {
      Stub.setInput('config', {
        table: {},
      });

      expect(() => component['tableId']).toThrow(
        '[TableWrapper] tableId is not defined in the table configuration.'
      );
    });
  });

  describe('isLoading$', () => {
    it('should return the isLoading$ observable from the config', () => {
      const mockIsLoading$ = new BehaviorSubject<boolean>(true);
      Stub.setInput('config', {
        isLoading$: mockIsLoading$,
      });

      expect(component['isLoading$']).toBe(mockIsLoading$);
    });

    it('should return null if isLoading$ is not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['isLoading$']).toBeNull();
    });
  });

  describe('showLoaderForInfiniteScroll', () => {
    it('should return the showLoaderForInfiniteScroll value from the config', () => {
      Stub.setInput('config', {
        showLoaderForInfiniteScroll: true,
      });

      expect(component['showLoaderForInfiniteScroll']).toBe(true);
    });

    it('should return false if showLoaderForInfiniteScroll is not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['showLoaderForInfiniteScroll']).toBe(false);
    });
  });

  describe('columnDefs', () => {
    it('should return the columnDefs from the config', () => {
      const mockColumnDefs = [{ colId: 'col1', headerName: 'Column 1' }];
      Stub.setInput('config', {
        table: { columnDefs: mockColumnDefs },
      });

      expect(component['columnDefs']).toBe(mockColumnDefs);
    });

    it('should return an empty array if columnDefs is not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['columnDefs']).toEqual([]);
    });
  });

  describe('hasToolbar', () => {
    it('should return the hasToolbar value from the config', () => {
      Stub.setInput('config', {
        hasToolbar: true,
      });

      expect(component['hasToolbar']).toBe(true);
    });

    it('should return false if hasToolbar is not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['hasToolbar']).toBe(false);
    });
  });

  describe('renderFloatingFilter', () => {
    it('should return true if hasToolbar is true and renderFloatingFilter is true', () => {
      Stub.setInput('config', {
        hasToolbar: true,
        renderFloatingFilter: true,
      });

      expect(component['renderFloatingFilter']).toBe(true);
    });

    it('should return false if hasToolbar is false', () => {
      Stub.setInput('config', {
        hasToolbar: false,
        renderFloatingFilter: true,
      });

      expect(component['renderFloatingFilter']).toBe(false);
    });

    it('should return false if renderFloatingFilter is not defined in the config', () => {
      Stub.setInput('config', {
        hasToolbar: true,
      });

      expect(component['renderFloatingFilter']).toBe(false);
    });
  });

  describe('customOnResetFilters', () => {
    it('should return the customOnResetFilters function from the config if hasToolbar is true', () => {
      const mockResetFilters = jest.fn();
      Stub.setInput('config', {
        hasToolbar: true,
        customOnResetFilters: mockResetFilters,
      });

      expect(component['customOnResetFilters']).toBe(mockResetFilters);
    });

    it('should return null if hasToolbar is false', () => {
      Stub.setInput('config', {
        hasToolbar: true,
      });

      expect(component['customOnResetFilters']).toBeNull();
    });
  });

  describe('customGetFilterCount', () => {
    it('should return the customGetFilterCount function from the config if hasToolbar is true', () => {
      const mockGetFilterCount = jest.fn();
      Stub.setInput('config', {
        hasToolbar: true,
        customGetFilterCount: mockGetFilterCount,
      });

      expect(component['customGetFilterCount']).toBe(mockGetFilterCount);
    });

    it('should return null if hasToolbar is false', () => {
      Stub.setInput('config', {
        hasToolbar: true,
      });

      expect(component['customGetFilterCount']).toBeNull();
    });
  });

  describe('hasTabView', () => {
    it('should return true if maxAllowedTabs is greater than 0 and hasTabView is true', () => {
      Stub.setInput('config', {
        maxAllowedTabs: 5,
        hasTabView: true,
      });

      expect(component['hasTabView']).toBe(true);
    });

    it('should return false if maxAllowedTabs is 0', () => {
      Stub.setInput('config', {
        maxAllowedTabs: 0,
        hasTabView: true,
      });

      expect(component['hasTabView']).toBe(false);
    });

    it('should return false if hasTabView is not defined in the config', () => {
      Stub.setInput('config', {
        maxAllowedTabs: 5,
      });

      expect(component['hasTabView']).toBe(false);
    });
  });

  describe('maxAllowedTabs', () => {
    it('should return the maxAllowedTabs value from the config', () => {
      Stub.setInput('config', {
        maxAllowedTabs: 5,
      });

      expect(component['maxAllowedTabs']).toBe(5);
    });

    it('should return 0 if maxAllowedTabs is not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['maxAllowedTabs']).toBe(0);
    });
  });

  describe('serverSideAutoGroup', () => {
    it('should return the serverSideAutoGroup value from the config', () => {
      const mockServerSideAutoGroup: ServerSideAutoGroupProps = {
        autoGroupColumnDef: { headerName: 'Group' },
        isServerSideGroup: jest.fn(),
        getServerSideGroupKey: jest.fn(),
      };
      Stub.setInput('config', {
        table: { serverSideAutoGroup: mockServerSideAutoGroup },
      });

      expect(component['serverSideAutoGroup']).toBe(mockServerSideAutoGroup);
    });

    it('should return null if serverSideAutoGroup is not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['serverSideAutoGroup']).toBeNull();
    });
  });

  describe('customTreeData', () => {
    it('should return the customTreeData value from the config', () => {
      const mockCustomTreeData: CustomTreeData = {
        getDataPath: jest.fn(),
        treeData: true,
      } as any;
      Stub.setInput('config', {
        table: { customTreeData: mockCustomTreeData },
      });

      expect(component['customTreeData']).toBe(mockCustomTreeData);
    });

    it('should return null if customTreeData is not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['customTreeData']).toBeNull();
    });
  });

  describe('callbacks', () => {
    it('should return the callbacks value from the config', () => {
      const mockCallbacks: AllowedCallbacks = {
        onGridReady: jest.fn(),
        onCellClicked: jest.fn(),
      };
      Stub.setInput('config', {
        callbacks: mockCallbacks,
      });

      expect(component['callbacks']).toBe(mockCallbacks);
    });

    it('should return null if callbacks are not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['callbacks']).toBeNull();
    });
  });

  describe('isBrowser', () => {
    it('should return true if the platform is a browser', () => {
      (isPlatformBrowser as jest.Mock).mockReturnValue(true);

      expect(component['isBrowser']).toBe(true);
      expect(isPlatformBrowser).toHaveBeenCalledWith('browser');
    });

    it('should return false if the platform is not a browser', () => {
      (isPlatformBrowser as jest.Mock).mockReturnValue(false);

      expect(component['isBrowser']).toBe(false);
      expect(isPlatformBrowser).toHaveBeenCalledWith('browser');
    });
  });

  describe('autoSizeStrategy', () => {
    it('should return the autoSizeStrategy from the config if defined', () => {
      const mockAutoSizeStrategy = { type: 'fitGridWidth' };
      Stub.setInput('config', {
        table: { autoSizeStrategy: mockAutoSizeStrategy },
      });

      expect(component['autoSizeStrategy']).toBe(mockAutoSizeStrategy);
    });

    it('should return undefined if autoSizeStrategy is not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['autoSizeStrategy']).toBeUndefined();
    });
  });

  describe('themeClass', () => {
    it('should return the themeClass from the config if defined', () => {
      Stub.setInput('config', {
        table: { themeClass: 'custom-theme' },
        tableClass: 'additional-class',
      });

      expect(component['themeClass']).toBe('custom-theme additional-class');
    });

    it('should return the default themeClass if not defined in the config', () => {
      Stub.setInput('config', {});

      expect(component['themeClass']).toBe('ag-theme-material');
    });

    it('should include additional tableClass if defined', () => {
      Stub.setInput('config', {
        tableClass: 'additional-class',
      });

      expect(component['themeClass']).toBe(
        'ag-theme-material additional-class'
      );
    });
  });

  describe('constructor', () => {
    it('should initialize the table and call init for backend tables', () => {
      const initSpy = jest.spyOn<any, any>(component, 'init');
      const setGridOptionsSpy = jest.spyOn<any, any>(
        component,
        'setGridOptions'
      );

      // Mock config and gridApi
      Stub.setInput('config', {
        table: { tableId: 'testTableId', columnDefs: [] },
      });

      Stub.detectChanges();

      expect(setGridOptionsSpy).toHaveBeenCalled();
      expect(initSpy).toHaveBeenCalled();
    });

    it('should not call init for frontend tables', () => {
      component['type'] = TableType.Frontend;
      const initSpy = jest.spyOn<any, any>(component, 'init');

      // Mock config and gridApi
      Stub.setInput('config', {
        table: { tableId: 'testTableId', columnDefs: [] },
      });

      Stub.detectChanges();

      expect(initSpy).not.toHaveBeenCalled();
    });

    it('should not initialize the table if config or gridApi is missing', () => {
      const setGridOptionsSpy = jest.spyOn<any, any>(
        component,
        'setGridOptions'
      );

      // Do not set config or gridApi
      Stub.detectChanges();

      expect(setGridOptionsSpy).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should initialize gridOptions with default and custom properties', () => {
      const mockLang = { noRowsToShow: 'No rows to show' };
      jest
        .spyOn(component['agGridLocalizationService'], 'lang')
        .mockReturnValue(mockLang);

      component.ngOnInit();

      expect(component['gridOptions']).toEqual(
        expect.objectContaining({
          ...component['tableDefaultProps'],
          localeText: mockLang,
          tooltipShowDelay: 0,
          onGridReady: expect.any(Function),
          onFilterChanged: expect.any(Function),
          onSortChanged: expect.any(Function),
          onColumnVisible: expect.any(Function),
          onDragStopped: expect.any(Function),
          onFirstDataRendered: expect.any(Function),
          onCellClicked: expect.any(Function),
          getRowId: expect.any(Function),
        })
      );
    });

    it('should call onGridReady when the grid is ready', () => {
      const onGridReadySpy = jest.spyOn<any, any>(component, 'onGridReady');
      component.ngOnInit();

      const mockParams = { api: Stub.getGridApi() } as any;
      component['gridOptions']?.onGridReady?.(mockParams);

      expect(onGridReadySpy).toHaveBeenCalledWith(mockParams);
    });

    it('should call saveGridFilters when filters are changed', () => {
      const saveGridFiltersSpy = jest.spyOn<any, any>(
        component,
        'saveGridFilters'
      );
      component.ngOnInit();

      const mockEvent = { api: Stub.getGridApi() } as any;
      component['gridOptions']?.onFilterChanged?.(mockEvent);

      expect(saveGridFiltersSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('should call saveGridSettings when sorting is changed', () => {
      const saveGridSettingsSpy = jest.spyOn<any, any>(
        component,
        'saveGridSettings'
      );
      component.ngOnInit();

      component['gridOptions']?.onSortChanged?.(null);

      expect(saveGridSettingsSpy).toHaveBeenCalled();
    });

    it('should call saveGridSettings when column visibility is changed', () => {
      const saveGridSettingsSpy = jest.spyOn<any, any>(
        component,
        'saveGridSettings'
      );
      component.ngOnInit();

      component['gridOptions']?.onColumnVisible?.(null);

      expect(saveGridSettingsSpy).toHaveBeenCalled();
    });

    it('should call saveGridSettings when dragging stops', () => {
      const saveGridSettingsSpy = jest.spyOn<any, any>(
        component,
        'saveGridSettings'
      );
      component.ngOnInit();

      component['gridOptions']?.onDragStopped?.(null);

      expect(saveGridSettingsSpy).toHaveBeenCalled();
    });

    it('should call onFirstDataRendered when the first data is rendered', () => {
      const onFirstDataRenderedSpy = jest.spyOn<any, any>(
        component,
        'onFirstDataRendered'
      );
      component.ngOnInit();

      const mockEvent = { api: Stub.getGridApi() } as any;
      component['gridOptions']?.onFirstDataRendered?.(mockEvent);

      expect(onFirstDataRenderedSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('should call onCellClicked when a cell is clicked', () => {
      const onCellClickedSpy = jest.spyOn<any, any>(component, 'onCellClicked');
      component.ngOnInit();

      const mockEvent = { api: Stub.getGridApi() } as any;
      component['gridOptions']?.onCellClicked?.(mockEvent);

      expect(onCellClickedSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('should call getRowId when retrieving a row ID', () => {
      const getRowIdSpy = jest.spyOn<any, any>(component, 'getRowId');
      component.ngOnInit();

      const mockParams = { data: { id: 'row1' } } as any;
      component['gridOptions']?.getRowId?.(mockParams);

      expect(getRowIdSpy).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('getRowId', () => {
    it('should return the row ID using the custom getRowId function from the config', () => {
      const mockGetRowId = jest.fn().mockReturnValue('customRowId');
      Stub.setInput('config', {
        table: { getRowId: mockGetRowId },
      });

      const mockParams = { data: { id: 'row1' } } as any;
      const result = component['getRowId'](mockParams);

      expect(mockGetRowId).toHaveBeenCalledWith(mockParams);
      expect(result).toBe('customRowId');
    });

    it('should throw an error if neither id nor data.id is defined', () => {
      const mockParams = { data: {} } as any;

      expect(() => component['getRowId'](mockParams)).toThrow(
        '[TableWrapper] Could not find id in row.'
      );
    });

    it('should return the id from params if it is defined', () => {
      const mockParams = { id: 'row1', data: {} } as any;
      const result = component['getRowId'](mockParams);

      expect(result).toBe('row1');
    });

    it('should return the id from data if params.id is undefined but data.id is defined', () => {
      const mockParams = { data: { id: 'row2' } } as any;
      const result = component['getRowId'](mockParams);

      expect(result).toBe('row2');
    });
  });

  describe('setActiveTab', () => {
    it('should set the active tab and apply grid options, column state, and filters', () => {
      const applyGridOptionsSpy = jest.spyOn<any, any>(
        component,
        'applyGridOptions'
      );
      const applyColumnStateSpy = jest.spyOn<any, any>(
        component,
        'applyColumnState'
      );
      const applyFiltersSpy = jest.spyOn<any, any>(component, 'applyFilters');

      const mockTabs: TableSetting<string>[] = [
        {
          id: 1,
          active: false,
          columns: [],
          layoutId: 1,
          defaultSetting: false,
        },
        {
          id: 2,
          active: false,
          columns: [],
          layoutId: 2,
          defaultSetting: true,
        },
      ];

      const result = component['setActiveTab'](mockTabs, 1);

      expect(result[0].active).toBe(true);
      expect(result[1].active).toBe(false);
      expect(component['activeTab']()).toBe(1);
      expect(applyGridOptionsSpy).toHaveBeenCalledWith(false);
      expect(applyColumnStateSpy).toHaveBeenCalledWith([], 1);
      expect(applyFiltersSpy).toHaveBeenCalledWith([]);
    });

    it('should set the first tab as active if no active tab is found', () => {
      const mockTabs: TableSetting<string>[] = [
        {
          id: 1,
          active: false,
          columns: [],
          layoutId: 1,
          defaultSetting: false,
        },
        {
          id: 2,
          active: false,
          columns: [],
          layoutId: 2,
          defaultSetting: true,
        },
      ];

      const result = component['setActiveTab'](mockTabs, 3);

      expect(result[0].active).toBe(true);
      expect(result[1].active).toBe(false);
      expect(component['activeTab']()).toBe(1);
    });
  });

  describe('applyFilters', () => {
    it('should set the filter model and redraw rows when filters are provided', () => {
      const setFilterModelSpy = jest.spyOn(
        component['gridApi'],
        'setFilterModel'
      );
      const redrawRowsSpy = jest.spyOn(component['gridApi'], 'redrawRows');

      const mockColumns: ColumnSetting<string>[] = [
        {
          colId: 'col1',
          filter: 'filter1',
          filterModel: 'model1',
          visible: false,
        },
        {
          colId: 'col2',
          filter: 'filter2',
          filterModel: null,
          visible: false,
        },
        {
          colId: 'col3',
          filter: null,
          filterModel: null,
          visible: false,
        },
      ];

      component['applyFilters'](mockColumns);

      expect(setFilterModelSpy).toHaveBeenCalledWith({
        col1: 'model1',
        col2: 'filter2',
      });
      expect(redrawRowsSpy).toHaveBeenCalled();
    });

    it('should not set the filter model or redraw rows if no filters are provided', () => {
      const setFilterModelSpy = jest.spyOn(
        component['gridApi'],
        'setFilterModel'
      );
      const redrawRowsSpy = jest.spyOn(component['gridApi'], 'redrawRows');

      const mockColumns: ColumnSetting<string>[] = [
        {
          colId: 'col1',
          filter: null,
          filterModel: null,
          visible: false,
        },
        {
          colId: 'col2',
          filter: null,
          filterModel: null,
          visible: false,
        },
      ];

      component['applyFilters'](mockColumns);

      expect(setFilterModelSpy).toHaveBeenCalledWith({});
      expect(redrawRowsSpy).toHaveBeenCalled();
    });

    it('should not throw an error if gridApi is undefined', () => {
      component['gridApi'] = undefined;

      expect(() => component['applyFilters']([])).not.toThrow();
    });
  });

  describe('applyGridOptions', () => {
    it('should set the sideBar with default tool panels when isDefaultTab is false', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      Stub.setInput('config', {});

      component['applyGridOptions'](false);

      expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
        toolPanels: [
          expect.objectContaining({ id: 'columns' }), // columnSideBar
          expect.objectContaining({ id: 'filters' }), // filters tool panel
        ],
      });
    });

    it('should set the sideBar with only the filters tool panel when isDefaultTab is true', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      Stub.setInput('config', {});

      component['applyGridOptions'](true);

      expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
        toolPanels: [
          expect.objectContaining({ id: 'filters' }), // filters tool panel
        ],
      });
    });

    it('should configure toolPanels for default tab when sideBar is undefined', () => {
      // Mock getSideBar to return toolPanels
      jest.spyOn(component as any, 'getSideBar').mockReturnValue({
        toolPanels: [
          { id: 'columns', labelDefault: 'Columns' },
          { id: 'filters', labelDefault: 'Filters' },
        ],
      });

      // Configure component.config to return undefined sideBar
      Stub.setInput('config', {
        table: {
          sideBar: undefined,
        },
      });

      Stub.detectChanges();

      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      // Call the method with isDefaultTab = true
      (component as any).applyGridOptions(true);

      // Verify toolPanels were configured correctly
      expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
        toolPanels: [
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
          },
        ],
      });
    });

    it('should configure toolPanels for custom tab when sideBar is undefined', () => {
      // Mock getSideBar to return toolPanels
      jest.spyOn(component as any, 'getSideBar').mockReturnValue({
        toolPanels: [
          { id: 'columns', labelDefault: 'Columns' },
          { id: 'filters', labelDefault: 'Filters' },
        ],
      });

      // Configure component.config to return undefined sideBar
      Stub.setInput('config', {
        table: {
          sideBar: undefined,
        },
      });

      Stub.detectChanges();

      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      // Call the method with isDefaultTab = false
      (component as any).applyGridOptions(false);

      // Verify toolPanels were configured correctly
      expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
        toolPanels: [
          {
            id: 'columns',
            labelKey: 'columns',
            labelDefault: 'Columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressPivotMode: true,
              suppressRowGroups: true,
              suppressValues: true,
            },
          },
          {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
          },
        ],
      });
    });

    it('should remove column panel for default tab when custom sideBar is provided', () => {
      // Mock getSideBar to return custom toolPanels
      const customSideBar = {
        toolPanels: [
          { id: 'columns', labelDefault: 'Custom Columns' },
          { id: 'filters', labelDefault: 'Custom Filters' },
          { id: 'custom', labelDefault: 'Custom Panel' },
        ],
      };

      jest.spyOn(component as any, 'getSideBar').mockReturnValue(customSideBar);

      // Configure component.config to return custom sideBar
      Stub.setInput('config', {
        table: {
          sideBar: customSideBar,
        },
      });

      Stub.detectChanges();

      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      // Call the method with isDefaultTab = true
      (component as any).applyGridOptions(true);

      // Verify column panel was removed
      const expectedToolPanels = [...customSideBar.toolPanels];
      expectedToolPanels.splice(0, 1); // Remove columns panel

      expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
        toolPanels: expectedToolPanels,
      });
    });

    it('should set suppressMovable and mainMenuItems for columns in default tab', () => {
      // Mock getColumnDefs to return some columns
      const mockColumns = [
        { colId: 'col1', field: 'col1' },
        { colId: 'col2', field: 'col2' },
      ];

      jest
        .spyOn(component['gridApi'], 'getColumnDefs')
        .mockReturnValue(mockColumns);

      // Mock hasFilters to return true
      jest.spyOn(component as any, 'hasFilters').mockReturnValue(true);

      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      // Call the method with isDefaultTab = true
      (component as any).applyGridOptions(true);

      // Verify columnDefs were configured correctly
      expect(setGridOptionSpy).toHaveBeenCalledWith('columnDefs', [
        {
          colId: 'col1',
          field: 'col1',
          suppressMovable: true,
          mainMenuItems: [
            'sortAscending',
            'sortDescending',
            'separator',
            'columnFilter',
            'separator',
            'autoSizeThis',
            'autoSizeAll',
          ],
        },
        {
          colId: 'col2',
          field: 'col2',
          suppressMovable: true,
          mainMenuItems: [
            'sortAscending',
            'sortDescending',
            'separator',
            'columnFilter',
            'separator',
            'autoSizeThis',
            'autoSizeAll',
          ],
        },
      ]);
    });

    it('should set suppressMovable to false and mainMenuItems to null for non-default tab', () => {
      // Mock getColumnDefs to return some columns
      const mockColumns = [
        { colId: 'col1', field: 'col1' },
        { colId: 'col2', field: 'col2' },
      ];

      jest
        .spyOn(component['gridApi'], 'getColumnDefs')
        .mockReturnValue(mockColumns);

      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      // Call the method with isDefaultTab = false
      (component as any).applyGridOptions(false);

      // Verify columnDefs were configured correctly
      expect(setGridOptionSpy).toHaveBeenCalledWith('columnDefs', [
        {
          colId: 'col1',
          field: 'col1',
          suppressMovable: false,
          mainMenuItems: null,
        },
        {
          colId: 'col2',
          mainMenuItems: null,
          suppressMovable: false,
          field: 'col2',
        },
      ]);
    });

    describe('toolPanels configuration', () => {
      it('should clear toolPanels and add filter panel when sideBar is undefined and isDefaultTab is true', () => {
        const setGridOptionSpy = jest.spyOn(
          component['gridApi'],
          'setGridOption'
        );
        Stub.setInput('config', {
          table: { sideBar: undefined },
        });

        component['applyGridOptions'](true);

        expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
          toolPanels: [
            expect.objectContaining({ id: 'filters' }), // Only filters panel
          ],
        });
      });

      it('should clear toolPanels and add column and filter panels when sideBar is undefined and isDefaultTab is false', () => {
        const setGridOptionSpy = jest.spyOn(
          component['gridApi'],
          'setGridOption'
        );
        Stub.setInput('config', {
          table: { sideBar: undefined },
        });

        component['applyGridOptions'](false);

        expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
          toolPanels: [
            expect.objectContaining({ id: 'columns' }), // Column sidebar
            expect.objectContaining({ id: 'filters' }), // Filters panel
          ],
        });
      });

      it('should remove the columns panel from toolPanels when sideBar is defined and isDefaultTab is true', () => {
        const setGridOptionSpy = jest.spyOn(
          component['gridApi'],
          'setGridOption'
        );
        const mockSideBar = {
          toolPanels: [
            { id: 'columns', labelDefault: 'Columns' },
            { id: 'filters', labelDefault: 'Filters' },
          ],
        };
        Stub.setInput('config', {
          table: { sideBar: mockSideBar },
        });

        component['applyGridOptions'](true);

        expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
          toolPanels: [expect.objectContaining({ id: 'filters' })], // Only filters panel
        });
      });

      it('should not modify toolPanels when no columns panel exists and isDefaultTab is true', () => {
        const setGridOptionSpy = jest.spyOn(
          component['gridApi'],
          'setGridOption'
        );
        const mockSideBar = {
          toolPanels: [
            { id: 'filters', labelDefault: 'Filters' },
            { id: 'other', labelDefault: 'Other' },
          ],
        };
        Stub.setInput('config', {
          table: { sideBar: mockSideBar },
        });

        component['applyGridOptions'](true);

        expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
          toolPanels: [
            expect.objectContaining({ id: 'filters' }),
            expect.objectContaining({ id: 'other' }),
          ],
        });
      });

      it('should not modify toolPanels when sideBar is defined and isDefaultTab is false', () => {
        const setGridOptionSpy = jest.spyOn(
          component['gridApi'],
          'setGridOption'
        );
        const mockSideBar = {
          toolPanels: [
            { id: 'columns', labelDefault: 'Columns' },
            { id: 'filters', labelDefault: 'Filters' },
          ],
        };
        Stub.setInput('config', {
          table: { sideBar: mockSideBar },
        });

        component['applyGridOptions'](false);

        expect(setGridOptionSpy).toHaveBeenCalledWith('sideBar', {
          toolPanels: [
            expect.objectContaining({ id: 'columns' }),
            expect.objectContaining({ id: 'filters' }),
          ],
        });
      });
    });
  });

  describe('getSideBar', () => {
    it('should return the sideBar from the config if defined', () => {
      const mockSideBar: SideBarDef = {
        toolPanels: [{ id: 'customPanel' } as any],
      };
      Stub.setInput('config', {
        table: { sideBar: mockSideBar },
      });

      Stub.detectChanges();

      const result = component['getSideBar']();

      expect(result).toBe(mockSideBar);
    });

    it('should return undefined if hasTabView is true', () => {
      Stub.setInput('config', {
        hasTabView: true,
        maxAllowedTabs: 2,
      });
      Stub.detectChanges();

      const result = component['getSideBar']();

      expect(result).toBeUndefined();
    });

    it('should return the default sideBar if no sideBar is defined in the config and hasTabView is false', () => {
      Stub.setInput('config', {
        hasTabView: false,
      });

      const result = component['getSideBar']();

      expect(result).toBe(sideBar);
    });
  });

  describe('applyColumnState', () => {
    it('should call applyColumnSettings with provided columns if columns are not empty', () => {
      const mockColumns: ColumnSetting<string>[] = [
        { colId: 'col1', visible: true, sort: 'asc', filterModel: null },
        { colId: 'col2', visible: false, sort: null, filterModel: null },
      ];

      component['applyColumnState'](mockColumns, 1);

      expect(applyColumnSettings).toHaveBeenCalledWith(
        component['gridApi'],
        mockColumns
      );
    });

    it('should call applyColumnSettings with initial column definitions if columns are empty', () => {
      const mockInitialColumnDefs = [
        { colId: 'col1', visible: true, sort: 'asc', filterModel: null },
        { colId: 'col2', visible: false, sort: null, filterModel: null },
      ] as any;

      Stub.setInput('config', {
        table: {
          initialColumnDefs: [
            { layoutId: 1, columnDefs: mockInitialColumnDefs },
          ],
        },
      });

      component['applyColumnState']([], 1);

      expect(applyColumnSettings).toHaveBeenCalledWith(
        component['gridApi'],
        mockInitialColumnDefs.map((colDef: any) => ({
          colId: colDef.colId,
          visible: colDef.visible,
          sort: colDef.sort || null,
          filterModel: colDef.filterModel || undefined,
          filter: colDef.filter || undefined,
          alwaysVisible: colDef.alwaysVisible || undefined,
        }))
      );
    });

    it('should not call applyColumnSettings if layoutId is not provided', () => {
      component['applyColumnState']([]);

      expect(applyColumnSettings).not.toHaveBeenCalled();
    });
  });

  describe('handleTabClick', () => {
    it('should call handleTab with TabAction.Add when add view toggle is clicked', () => {
      const handleTabSpy = jest.spyOn<any, any>(component, 'handleTab');
      const mockEvent = { id: TableService.addId };

      component['handleTabClick'](mockEvent);

      expect(handleTabSpy).toHaveBeenCalledWith(TabAction.Add, mockEvent);
    });

    it('should call deleteTab when delete icon is clicked', () => {
      const deleteTabSpy = jest.spyOn<any, any>(component, 'deleteTab');
      const mockEvent = { iconName: IconType.Delete };

      component['handleTabClick'](mockEvent);

      expect(deleteTabSpy).toHaveBeenCalledWith(mockEvent);
    });

    it('should call handleTab with TabAction.Edit when edit icon is clicked', () => {
      const handleTabSpy = jest.spyOn<any, any>(component, 'handleTab');
      const mockEvent = { iconName: IconType.Edit };

      component['handleTabClick'](mockEvent);

      expect(handleTabSpy).toHaveBeenCalledWith(TabAction.Edit, mockEvent);
    });

    it('should set the given view toggle as active when no special action is triggered', () => {
      const setActiveTabSpy = jest.spyOn<any, any>(component, 'setActiveTab');
      const setTableSettingsSpy = jest.spyOn(
        component['tableService'],
        'setTableSettings$'
      );
      const mockTabs = [
        { id: 1, defaultSetting: false },
        { id: 2, defaultSetting: true },
      ] as any;
      const mockEvent = { id: 1 };

      jest
        .spyOn(component['tableService'].tableSettings$, 'getValue')
        .mockReturnValue(mockTabs);

      component['handleTabClick'](mockEvent);

      expect(setActiveTabSpy).toHaveBeenCalledWith(mockTabs, 1);
      expect(setTableSettingsSpy).toHaveBeenCalled();
    });

    it('should set the default tab as active if no id or viewId is provided', () => {
      const setActiveTabSpy = jest.spyOn<any, any>(component, 'setActiveTab');
      const setTableSettingsSpy = jest.spyOn(
        component['tableService'],
        'setTableSettings$'
      );
      const mockTabs = [
        { id: 1, defaultSetting: false },
        { id: 2, defaultSetting: true },
      ] as any;
      const mockEvent = {};

      jest
        .spyOn(component['tableService'].tableSettings$, 'getValue')
        .mockReturnValue(mockTabs);

      component['handleTabClick'](mockEvent);

      expect(setActiveTabSpy).toHaveBeenCalledWith(mockTabs, 2);
      expect(setTableSettingsSpy).toHaveBeenCalled();
    });
  });

  describe('handleTab', () => {
    it('should add a new tab when action is TabAction.Add', () => {
      const mockTabs = [
        { id: 1, defaultSetting: false },
        { id: 2, defaultSetting: true },
        { id: 999_999, defaultSetting: false }, // Add button
      ] as any;
      jest
        .spyOn(component['tableService'].tableSettings$, 'getValue')
        .mockReturnValue(mockTabs);

      const setActiveTabSpy = jest.spyOn<any, any>(component, 'setActiveTab');
      const checkAddButtonSpy = jest.spyOn<any, any>(
        component,
        'checkAddButton'
      );
      const setTableSettingsSpy = jest.spyOn(
        component['tableService'],
        'setTableSettings$'
      );

      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of({ title: 'New Tab', layoutId: 3 }),
      } as any);

      component['handleTab'](TabAction.Add, {});

      expect(setActiveTabSpy).toHaveBeenCalled();
      expect(checkAddButtonSpy).toHaveBeenCalled();
      expect(setTableSettingsSpy).toHaveBeenCalled();
    });

    it('should edit an existing tab when action is TabAction.Edit', () => {
      const mockTabs = [
        { id: 1, title: 'Tab 1', defaultSetting: false },
        { id: 2, title: 'Tab 2', defaultSetting: true },
      ] as any;
      jest
        .spyOn(component['tableService'].tableSettings$, 'getValue')
        .mockReturnValue(mockTabs);

      const checkAddButtonSpy = jest.spyOn<any, any>(
        component,
        'checkAddButton'
      );
      const setTableSettingsSpy = jest.spyOn(
        component['tableService'],
        'setTableSettings$'
      );

      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of({ title: 'Updated Tab', layoutId: 2 }),
      } as any);

      component['handleTab'](TabAction.Edit, { viewId: 1 });

      expect(mockTabs[0].title).toBe('Updated Tab');
      expect(checkAddButtonSpy).toHaveBeenCalled();
      expect(setTableSettingsSpy).toHaveBeenCalled();
    });

    it('should do nothing if dialog is closed without providing title or layoutId', () => {
      const mockTabs = [
        { id: 1, title: 'Tab 1', defaultSetting: false },
        { id: 2, title: 'Tab 2', defaultSetting: true },
      ] as any;
      jest
        .spyOn(component['tableService'].tableSettings$, 'getValue')
        .mockReturnValue(mockTabs);

      const setActiveTabSpy = jest.spyOn<any, any>(component, 'setActiveTab');
      const checkAddButtonSpy = jest.spyOn<any, any>(
        component,
        'checkAddButton'
      );
      const setTableSettingsSpy = jest.spyOn(
        component['tableService'],
        'setTableSettings$'
      );

      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => EMPTY,
      } as any);

      component['handleTab'](TabAction.Add, {});

      expect(setActiveTabSpy).not.toHaveBeenCalled();
      expect(checkAddButtonSpy).not.toHaveBeenCalled();
      expect(setTableSettingsSpy).not.toHaveBeenCalled();
    });
  });

  describe('getNewTabIndex', () => {
    it('should return max ID + 1 when custom tabs exist', () => {
      const tabs = [
        { id: 1, defaultSetting: false },
        { id: 3, defaultSetting: false }, // Highest ID custom tab
        { id: 2, defaultSetting: true },
        { id: TableService.addId, defaultSetting: false }, // Add button tab
      ] as TableSetting<string>[];

      const result = component['getNewTabIndex'](tabs);
      expect(result).toBe(4); // 3 + 1
    });

    it('should return second-to-last tab ID + 1 when no custom tabs exist', () => {
      const tabs = [
        { id: 1, defaultSetting: true },
        { id: 2, defaultSetting: true }, // Second-to-last tab
        { id: TableService.addId, defaultSetting: false }, // Add button tab
      ] as TableSetting<string>[];

      const result = component['getNewTabIndex'](tabs);
      expect(result).toBe(3); // 2 + 1
    });

    it('should handle empty array gracefully', () => {
      const tabs = [] as TableSetting<string>[];

      expect(component['getNewTabIndex'](tabs)).toBe(1); // Default to 1
    });

    it('should ignore add button when calculating next ID', () => {
      const tabs = [
        { id: 1, defaultSetting: true },
        { id: TableService.addId, defaultSetting: false },
      ] as TableSetting<string>[];

      const result = component['getNewTabIndex'](tabs);
      expect(result).toBe(2); // 1 + 1, not influenced by the large addId value
    });

    it('should work with non-sequential IDs', () => {
      const tabs = [
        { id: 5, defaultSetting: false },
        { id: 10, defaultSetting: false }, // Highest custom tab ID
        { id: 2, defaultSetting: true },
        { id: TableService.addId, defaultSetting: false },
      ] as TableSetting<string>[];

      const result = component['getNewTabIndex'](tabs);
      expect(result).toBe(11); // 10 + 1
    });
  });

  describe('checkAddButton', () => {
    it('should disable the add button if the number of custom tabs exceeds the maxAllowedTabs', () => {
      Stub.setInput('config', { maxAllowedTabs: 2 });

      const mockTabs: TableSetting<string>[] = [
        { id: 1, defaultSetting: false },
        { id: 2, defaultSetting: false },
        { id: 999_999, defaultSetting: false, icons: [] }, // Add button
      ] as any;

      const result = component['checkAddButton'](mockTabs);

      expect(result.find((tab) => tab.id === 999_999)?.disabled).toBe(true);
      expect(result.find((tab) => tab.id === 999_999)?.icons).toEqual([
        { name: IconType.Add, disabled: true },
      ]);
    });

    it('should enable the add button if the number of custom tabs is less than maxAllowedTabs', () => {
      Stub.setInput('config', { maxAllowedTabs: 3 });

      const mockTabs: TableSetting<string>[] = [
        { id: 1, defaultSetting: false },
        { id: 2, defaultSetting: false },
        { id: 999_999, defaultSetting: false, icons: [] }, // Add button
      ] as any;

      const result = component['checkAddButton'](mockTabs);

      expect(result.find((tab) => tab.id === 999_999)?.disabled).toBe(false);
      expect(result.find((tab) => tab.id === 999_999)?.icons).toEqual([
        { name: IconType.Add, disabled: false },
      ]);
    });

    it('should disable the add button if maxAllowedTabs is 0', () => {
      Stub.setInput('config', { maxAllowedTabs: 0 });

      const mockTabs: TableSetting<string>[] = [
        { id: 1, defaultSetting: false },
        { id: 999_999, defaultSetting: false, icons: [] }, // Add button
      ] as any;

      const result = component['checkAddButton'](mockTabs);

      expect(result.find((tab) => tab.id === 999_999)?.disabled).toBe(true);
      expect(result.find((tab) => tab.id === 999_999)?.icons).toEqual([
        { name: IconType.Add, disabled: true },
      ]);
    });

    it('should not modify the add button if it is not present in the tabs', () => {
      Stub.setInput('config', { maxAllowedTabs: 3 });

      const mockTabs: TableSetting<string>[] = [
        { id: 1, defaultSetting: false },
        { id: 2, defaultSetting: false },
      ] as any;

      const result = component['checkAddButton'](mockTabs);

      expect(result.find((tab) => tab.id === 999_999)).toBeUndefined();
    });
  });

  describe('deleteTab', () => {
    it('should delete the tab and update the active tab if confirmed', () => {
      const mockTabs = [
        { id: 1, defaultSetting: false },
        { id: 2, defaultSetting: true },
        { id: 3, defaultSetting: false },
      ] as any;
      jest
        .spyOn(component['tableService'].tableSettings$, 'getValue')
        .mockReturnValue(mockTabs);

      const checkAddButtonSpy = jest.spyOn<any, any>(
        component,
        'checkAddButton'
      );
      const setActiveTabSpy = jest.spyOn<any, any>(component, 'setActiveTab');
      const setTableSettingsSpy = jest
        .spyOn(component['tableService'], 'setTableSettings$')
        .mockReturnValue(of(true));

      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(true),
      } as any);

      component['deleteTab']({ viewId: 1 });

      expect(checkAddButtonSpy).toHaveBeenCalled();
      expect(setActiveTabSpy).toHaveBeenCalledWith(
        expect.any(Array),
        2 // Default tab ID
      );
      expect(setTableSettingsSpy).toHaveBeenCalledWith(1);
    });

    it('should not delete the tab if the confirmation is canceled', () => {
      const mockTabs = [
        { id: 1, defaultSetting: false },
        { id: 2, defaultSetting: true },
      ] as any;
      jest
        .spyOn(component['tableService'].tableSettings$, 'getValue')
        .mockReturnValue(mockTabs);

      const checkAddButtonSpy = jest.spyOn<any, any>(
        component,
        'checkAddButton'
      );
      const setActiveTabSpy = jest.spyOn<any, any>(component, 'setActiveTab');
      const setTableSettingsSpy = jest.spyOn(
        component['tableService'],
        'setTableSettings$'
      );

      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(false),
      } as any);

      component['deleteTab']({ viewId: 1 });

      expect(checkAddButtonSpy).not.toHaveBeenCalled();
      expect(setActiveTabSpy).not.toHaveBeenCalled();
      expect(setTableSettingsSpy).not.toHaveBeenCalled();
    });

    it('should handle cases where the tab to delete is not found', () => {
      const mockTabs = [
        { id: 1, defaultSetting: false },
        { id: 2, defaultSetting: true },
      ] as any;
      jest
        .spyOn(component['tableService'].tableSettings$, 'getValue')
        .mockReturnValue(mockTabs);

      const checkAddButtonSpy = jest.spyOn<any, any>(
        component,
        'checkAddButton'
      );
      const setActiveTabSpy = jest.spyOn<any, any>(component, 'setActiveTab');
      const setTableSettingsSpy = jest.spyOn(
        component['tableService'],
        'setTableSettings$'
      );

      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(true),
      } as any);

      component['deleteTab']({ viewId: 999 }); // Non-existent tab ID

      expect(checkAddButtonSpy).not.toHaveBeenCalled();
      expect(setActiveTabSpy).not.toHaveBeenCalled();
      expect(setTableSettingsSpy).not.toHaveBeenCalled();
    });
  });

  describe('setGridOptions', () => {
    it('should set default grid options from the table configuration', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      Stub.setInput('config', {
        table: {
          columnDefs: [
            { columnDefs: [{ colId: 'col1', headerName: 'Column 1' }] },
          ],
          context: { key: 'value' },
          defaultColDef: { sortable: true },
          getRowStyle: jest.fn(),
          rowClassRules: { rule: 'class' },
          headerHeight: 50,
          cellSelection: true,
          suppressCellFocus: true,
          loadingOverlayComponentParams: { message: 'Loading...' },
          noRowsOverlayComponentParams: { message: 'No rows' },
        },
      });

      Stub.detectChanges();

      component['setGridOptions']();

      expect(setGridOptionSpy).toHaveBeenCalledWith('columnDefs', [
        { colId: 'col1', headerName: 'Column 1' },
      ]);
      expect(setGridOptionSpy).toHaveBeenCalledWith('context', {
        key: 'value',
      });
      expect(setGridOptionSpy).toHaveBeenCalledWith('defaultColDef', {
        sortable: true,
      });
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'getRowStyle',
        expect.any(Function)
      );
      expect(setGridOptionSpy).toHaveBeenCalledWith('rowClassRules', {
        rule: 'class',
      });
      expect(setGridOptionSpy).toHaveBeenCalledWith('headerHeight', 50);
      expect(setGridOptionSpy).toHaveBeenCalledWith('cellSelection', true);
      expect(setGridOptionSpy).toHaveBeenCalledWith('suppressCellFocus', true);
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'loadingOverlayComponentParams',
        { message: 'Loading...' }
      );
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'noRowsOverlayComponentParams',
        { message: 'No rows' }
      );
    });

    it('should set server-side auto group options if defined', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      Stub.setInput('config', {
        table: {
          serverSideAutoGroup: {
            autoGroupColumnDef: { headerName: 'Group' },
            isServerSideGroup: jest.fn(),
          },
        },
      });
      Stub.detectChanges();

      component['setGridOptions']();

      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'autoGroupColumnDef',
        expect.objectContaining({ headerName: 'Group' })
      );
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'isServerSideGroup',
        expect.any(Function)
      );
    });

    it('should set custom tree data options if defined', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      Stub.setInput('config', {
        table: {
          customTreeData: {
            getDataPath: jest.fn(),
            treeData: true,
          },
        },
      });
      Stub.detectChanges();

      component['setGridOptions']();

      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'getDataPath',
        expect.any(Function)
      );
      expect(setGridOptionSpy).toHaveBeenCalledWith('treeData', true);
    });

    it('should initialize table settings and set active tab if hasTabView is true', () => {
      const initSpy = jest.spyOn(component['tableService'], 'init');
      const setActiveTabSpy = jest.spyOn<any, any>(component, 'setActiveTab');
      const mockTableSettings = [
        { id: 1, active: true },
        { id: 2, active: false },
      ] as any;

      component['tableService'].tableSettings$.next(mockTableSettings);

      Stub.setInput('config', {
        table: {
          tableId: 'testTable',
          columnDefs: [{ colId: 'col1', headerName: 'Column 1' }],
        },
        hasTabView: true,
        maxAllowedTabs: 2,
      });
      Stub.detectChanges();

      component['setGridOptions']();

      expect(initSpy).toHaveBeenCalledWith({
        tableId: 'testTable',
        columnDefinitions: [{ colId: 'col1', headerName: 'Column 1' }],
        gridApi: component['gridApi'],
        maxAllowedTabs: 2,
      });
      expect(setActiveTabSpy).toHaveBeenCalledWith(mockTableSettings, 1);
    });

    it('should not initialize table settings if hasTabView is false', () => {
      const initSpy = jest.spyOn(component['tableService'], 'init');
      Stub.setInput('config', {
        hasTabView: false,
      });
      Stub.detectChanges();

      component['setGridOptions']();

      expect(initSpy).not.toHaveBeenCalled();
    });
  });

  describe('onFirstDataRendered', () => {
    it('should auto-size all columns if autoSizeStrategy is not false or undefined', () => {
      const autoSizeAllColumnsSpy = jest.spyOn(
        component['gridApi'],
        'autoSizeAllColumns'
      );
      Stub.setInput('config', {
        table: { autoSizeStrategy: undefined },
      });

      const mockEvent = { api: component['gridApi'] } as any;
      component['onFirstDataRendered'](mockEvent);

      expect(autoSizeAllColumnsSpy).toHaveBeenCalled();
    });

    it('should not auto-size columns if autoSizeStrategy is false', () => {
      const autoSizeAllColumnsSpy = jest.spyOn(
        component['gridApi'],
        'autoSizeAllColumns'
      );
      Stub.setInput('config', {
        table: { autoSizeStrategy: false },
      });

      const mockEvent = { api: component['gridApi'] } as any;
      component['onFirstDataRendered'](mockEvent);

      expect(autoSizeAllColumnsSpy).not.toHaveBeenCalled();
    });

    it('should call the onFirstDataRendered callback if defined', () => {
      const mockCallback = jest.fn();
      Stub.setInput('config', {
        callbacks: { onFirstDataRendered: mockCallback },
      });

      const mockEvent = { api: component['gridApi'] } as any;
      component['onFirstDataRendered'](mockEvent);

      expect(mockCallback).toHaveBeenCalledWith(mockEvent);
    });

    it('should not call autoSizeAllColumns or the callback if the grid is destroyed', () => {
      const autoSizeAllColumnsSpy = jest.spyOn(
        component['gridApi'],
        'autoSizeAllColumns'
      );
      const mockCallback = jest.fn();
      Stub.setInput('config', {
        callbacks: { onFirstDataRendered: mockCallback },
      });

      const mockEvent = {
        api: { ...component['gridApi'], isDestroyed: () => true },
      } as any;
      component['onFirstDataRendered'](mockEvent);

      expect(autoSizeAllColumnsSpy).not.toHaveBeenCalled();
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('onCellClicked', () => {
    it('should call the onCellClicked callback if defined and the grid is not destroyed', () => {
      const mockCallback = jest.fn();
      Stub.setInput('config', {
        callbacks: { onCellClicked: mockCallback },
      });

      const mockEvent = {
        api: { isDestroyed: () => false },
        data: { id: 'row1' },
      } as any;

      component['onCellClicked'](mockEvent);

      expect(mockCallback).toHaveBeenCalledWith(mockEvent);
    });

    it('should not call the onCellClicked callback if the grid is destroyed', () => {
      const mockCallback = jest.fn();
      Stub.setInput('config', {
        callbacks: { onCellClicked: mockCallback },
      });

      const mockEvent = {
        api: { isDestroyed: () => true },
        data: { id: 'row1' },
      } as any;

      component['onCellClicked'](mockEvent);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should not throw an error if the onCellClicked callback is not defined', () => {
      Stub.setInput('config', {});

      const mockEvent = {
        api: { isDestroyed: () => false },
        data: { id: 'row1' },
      } as any;

      expect(() => component['onCellClicked'](mockEvent)).not.toThrow();
    });
  });

  describe('getDataSource', () => {
    it('should return a valid IServerSideDatasource object', () => {
      const dataSource: IServerSideDatasource = component['getDataSource']();

      expect(dataSource).toBeDefined();
      expect(dataSource.getRows).toBeInstanceOf(Function);
    });

    it('should not throw an error when getRows is called', () => {
      const dataSource: IServerSideDatasource = component['getDataSource']();

      expect(() => dataSource.getRows({} as any)).not.toThrow();
    });
  });

  describe('onGridReady', () => {
    it('should set the gridApi and emit it via getGridApi', () => {
      const emitSpy = jest.spyOn(component['getGridApi'], 'emit');
      const mockParams = { api: component['gridApi'] } as any;

      component['onGridReady'](mockParams);

      expect(component['gridApi']).toBe(mockParams.api);
      expect(emitSpy).toHaveBeenCalledWith(mockParams.api);
    });

    it('should call init if the table type is Frontend', () => {
      component['type'] = TableType.Frontend;
      const initSpy = jest.spyOn<any, any>(component, 'init');

      const mockParams = { api: component['gridApi'] } as any;
      component['onGridReady'](mockParams);

      expect(initSpy).toHaveBeenCalled();
    });

    it('should refresh server-side data if reload$ emits true and table type is Backend', () => {
      const refreshServerSideSpy = jest.spyOn(
        component['gridApi'],
        'refreshServerSide'
      );
      Stub.setInput('reload$', new BehaviorSubject(true));
      Stub.detectChanges();

      const mockParams = { api: component['gridApi'] } as any;
      component['onGridReady'](mockParams);

      expect(refreshServerSideSpy).toHaveBeenCalledWith({ purge: true });
    });

    it('should call loadData if reload$ emits true and table type is Frontend', () => {
      component['type'] = TableType.Frontend;
      const loadDataSpy = jest.spyOn<any, any>(component, 'loadData');
      Stub.setInput('reload$', new BehaviorSubject(true));
      Stub.detectChanges();

      const mockParams = { api: component['gridApi'] } as any;
      component['onGridReady'](mockParams);

      expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should set the grid options and server-side datasource for Backend tables', () => {
      const setGridOptionsSpy = jest.spyOn<any, any>(
        component,
        'setGridOptions'
      );
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      const mockParams = { api: component['gridApi'] } as any;
      component['onGridReady'](mockParams);

      expect(setGridOptionsSpy).toHaveBeenCalled();
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'serverSideDatasource',
        expect.any(Object)
      );
    });

    it('should show or hide the loader based on isLoading$', () => {
      const showLoaderSpy = jest.spyOn<any, any>(component, 'showLoader');
      const hideOverlaySpy = jest.spyOn(component['gridApi'], 'hideOverlay');

      Stub.setInput('config', {
        isLoading$: new BehaviorSubject(true),
        table: {},
      });
      Stub.detectChanges();

      const mockParams = { api: component['gridApi'] } as any;
      component['onGridReady'](mockParams);
      (component['isLoading$'] as any).next(true);

      expect(showLoaderSpy).toHaveBeenCalled();

      (component['isLoading$'] as any).next(false);
      expect(hideOverlaySpy).toHaveBeenCalled();
    });

    it('should call the onGridReady callback if defined', () => {
      const mockCallback = jest.fn();
      Stub.setInput('config', {
        callbacks: { onGridReady: mockCallback },
      });

      const mockParams = { api: component['gridApi'] } as any;
      component['onGridReady'](mockParams);

      expect(mockCallback).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('saveGridFilters', () => {
    it('should emit the formatted filter model via onColumnFilterChange', () => {
      const emitSpy = jest.spyOn(component['onColumnFilterChange'], 'emit');
      const mockFilterModel = { col1: 'filter1' };
      const formattedFilterModel = { col1: 'formattedFilter1' };
      jest
        .spyOn(component['gridApi'], 'getFilterModel')
        .mockReturnValue(mockFilterModel);
      (formatFilterModelForBackend as jest.Mock).mockReturnValue(
        formattedFilterModel
      );

      const mockEvent = { api: component['gridApi'] } as FilterChangedEvent;
      component['saveGridFilters'](mockEvent);

      expect(formatFilterModelForBackend).toHaveBeenCalledWith(mockFilterModel);
      expect(emitSpy).toHaveBeenCalledWith(formattedFilterModel);
    });

    it('should emit the row count via dataFetchedEvent$ if the table type is Frontend', () => {
      component['type'] = TableType.Frontend;

      const dataFetchedEventSpy = jest.spyOn(
        component['dataFetchedEvent$'](),
        'next'
      );
      jest
        .spyOn(component['gridApi'], 'getDisplayedRowCount')
        .mockReturnValue(10);

      const mockEvent = { api: component['gridApi'] } as FilterChangedEvent;
      component['saveGridFilters'](mockEvent);

      expect(dataFetchedEventSpy).toHaveBeenCalledWith({ rowCount: 10 });
    });

    it('should not emit the row count if the table type is Backend', () => {
      component['type'] = TableType.Backend;
      const dataFetchedEventSpy = jest.spyOn(
        component['dataFetchedEvent$'](),
        'next'
      );

      const mockEvent = { api: component['gridApi'] } as FilterChangedEvent;
      component['saveGridFilters'](mockEvent);

      expect(dataFetchedEventSpy).not.toHaveBeenCalled();
    });

    it('should call saveGridSettings', () => {
      const saveGridSettingsSpy = jest.spyOn(
        component as any,
        'saveGridSettings'
      );

      const mockEvent = { api: component['gridApi'] } as FilterChangedEvent;
      component['saveGridFilters'](mockEvent);

      expect(saveGridSettingsSpy).toHaveBeenCalled();
    });
  });

  describe('saveGridSettings', () => {
    it('should call setTableSettings$ with the active tab if initialized and hasTabView is true', () => {
      component['initialized'] = true;

      Stub.setInput('config', {
        hasTabView: true,
        maxAllowedTabs: 2,
      });
      Stub.detectChanges();

      const setTableSettingsSpy = jest
        .spyOn(component['tableService'], 'setTableSettings$')
        .mockReturnValue({ subscribe: jest.fn() } as any);

      const activeTabSpy = jest
        .spyOn(component as any, 'activeTab')
        .mockReturnValue(1);

      component['saveGridSettings']();

      expect(activeTabSpy).toHaveBeenCalled();
      expect(setTableSettingsSpy).toHaveBeenCalledWith(1);
    });

    it('should not call setTableSettings$ if not initialized', () => {
      component['initialized'] = false;
      Stub.setInput('config', {
        hasTabView: true,
        maxAllowedTabs: 2,
      });
      Stub.detectChanges();
      const setTableSettingsSpy = jest.spyOn(
        component['tableService'],
        'setTableSettings$'
      );

      component['saveGridSettings']();

      expect(setTableSettingsSpy).not.toHaveBeenCalled();
    });

    it('should not call setTableSettings$ if hasTabView is false', () => {
      component['initialized'] = true;
      Stub.setInput('config', { hasTabView: false });
      Stub.detectChanges();
      const setTableSettingsSpy = jest.spyOn(
        component['tableService'],
        'setTableSettings$'
      );

      component['saveGridSettings']();

      expect(setTableSettingsSpy).not.toHaveBeenCalled();
    });
  });

  describe('hasFilters', () => {
    it('should return true if there are active filters in the grid', () => {
      jest.spyOn(component['gridApi'], 'getFilterModel').mockReturnValue({
        col1: 'filter1',
      });

      const result = component['hasFilters']();

      expect(result).toBe(true);
    });

    it('should return false if there are no active filters in the grid', () => {
      jest.spyOn(component['gridApi'], 'getFilterModel').mockReturnValue({});

      const result = component['hasFilters']();

      expect(result).toBe(false);
    });

    it('should return false if gridApi is undefined', () => {
      component['gridApi'] = undefined;

      const result = component['hasFilters']();

      expect(result).toBe(false);
    });
  });

  describe('handleFetchError$', () => {
    it('should handle SAP error details and call messageFromSAP', (done) => {
      const mockError: HttpError = {
        details: {
          values: {
            [SapErrorMessageHeader.MessageNumber]: 123,
            [SapErrorMessageHeader.MessageId]: '456',
            [SapErrorMessageHeader.MessageV1]: 'Value1',
            [SapErrorMessageHeader.MessageV2]: 'Value2',
            [SapErrorMessageHeader.MessageV3]: 'Value3',
            [SapErrorMessageHeader.MessageV4]: 'Value4',
          },
        },
      } as any;
      jest.spyOn(ErrorHelper, 'isProblemDetail').mockReturnValue(true);

      const mockParams = {
        success: jest.fn(),
      } as unknown as IServerSideGetRowsParams;

      component['handleFetchError$'](mockError, mockParams)
        .pipe(take(1), isEmpty())
        .subscribe((empty: boolean) => {
          expect(empty).toEqual(true);

          expect(ErrorHelper.isProblemDetail).toHaveBeenCalledWith(
            mockError.details
          );
          expect(messageFromSAP).toHaveBeenCalledWith(
            'error.loading_failed',
            123,
            '456',
            'Value1',
            'Value2',
            'Value3',
            'Value4'
          );
          expect(mockParams.success).toHaveBeenCalledWith({
            rowData: [],
            rowCount: 0,
          });

          done();
        });
    });

    it('should handle generic errors and call translate', (done) => {
      const mockError: HttpError = {} as any;
      jest.spyOn(ErrorHelper, 'isProblemDetail').mockReturnValue(false);

      const mockParams = {
        success: jest.fn(),
      } as unknown as IServerSideGetRowsParams;

      component['handleFetchError$'](mockError, mockParams)
        .pipe(take(1), isEmpty())
        .subscribe((empty: boolean) => {
          expect(empty).toEqual(true);

          expect(ErrorHelper.isProblemDetail).toHaveBeenCalledWith(
            mockError.details
          );
          expect(mockParams.success).toHaveBeenCalledWith({
            rowData: [],
            rowCount: 0,
          });

          done();
        });
    });

    it('should call showMessage with the error message', (done) => {
      const showMessageSpy = jest.spyOn(component as any, 'showMessage');
      const mockError: HttpError = {} as any;
      jest.spyOn(ErrorHelper, 'isProblemDetail').mockReturnValue(false);

      const mockParams = {
        success: jest.fn(),
      } as unknown as IServerSideGetRowsParams;

      component['handleFetchError$'](mockError, mockParams)
        .pipe(take(1), isEmpty())
        .subscribe((empty: boolean) => {
          expect(empty).toEqual(true);
          done();
        });

      expect(showMessageSpy).toHaveBeenCalledWith('error.loading_failed');
    });

    it('should not throw an error if params is null', (done) => {
      const mockError: HttpError = {} as any;
      jest.spyOn(ErrorHelper, 'isProblemDetail').mockReturnValue(false);

      expect(() =>
        component['handleFetchError$'](mockError, null)
          .pipe(take(1), isEmpty())
          .subscribe((empty: boolean) => {
            expect(empty).toEqual(true);
            done();
          })
      ).not.toThrow();
    });
  });

  describe('showMessage', () => {
    it('should set the loading option to false, set the noRowsOverlayComponentParams, and show the no rows overlay', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const showNoRowsOverlaySpy = jest.spyOn(
        component['gridApi'],
        'showNoRowsOverlay'
      );

      component['showMessage']('Test message');

      expect(setGridOptionSpy).toHaveBeenCalledWith('loading', false);
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'noRowsOverlayComponentParams',
        {
          message: 'Test message',
        }
      );
      expect(showNoRowsOverlaySpy).toHaveBeenCalled();
    });

    it('should not throw an error if gridApi is undefined', () => {
      component['gridApi'] = undefined;

      expect(() => component['showMessage']('Test message')).not.toThrow();
    });
  });

  describe('showLoader', () => {
    it('should hide the overlay and set the loading option to true', () => {
      const hideOverlaySpy = jest.spyOn(component['gridApi'], 'hideOverlay');
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      component['showLoader']();

      expect(hideOverlaySpy).toHaveBeenCalled();
      expect(setGridOptionSpy).toHaveBeenCalledWith('loading', true);
    });

    it('should not throw an error if gridApi is undefined', () => {
      component['gridApi'] = undefined;

      expect(() => component['showLoader']()).not.toThrow();
    });
  });

  describe('hideOverlays', () => {
    it('should set the loading option to false and hide the overlay', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      const hideOverlaySpy = jest.spyOn(component['gridApi'], 'hideOverlay');

      component['hideOverlays']();

      expect(setGridOptionSpy).toHaveBeenCalledWith('loading', false);
      expect(hideOverlaySpy).toHaveBeenCalled();
    });

    it('should not throw an error if gridApi is undefined', () => {
      component['gridApi'] = undefined;

      expect(() => component['hideOverlays']()).not.toThrow();
    });
  });
});
