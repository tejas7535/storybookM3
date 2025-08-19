import {
  CellDoubleClickedEvent,
  CellKeyDownEvent,
  GridApi,
} from 'ag-grid-enterprise';

import { GlobalSelectionUtils } from '../../feature/global-selection/global-selection.utils';
import {
  agTextColumnFilter,
  clientSideTableDefaultProps,
  columnSideBar,
  defaultRowHeight,
  getColFilter,
  getCustomTreeDataAutoGroupColumnDef,
  getDefaultColDef,
  getDefaultColumn,
  KeyEventEnum,
  refreshGridFilters,
  serverSideTableDefaultProps,
  sideBar,
  tableDefaultProps,
} from './grid-defaults';
import { AgGridFilterType } from './grid-types';

// Mock dependencies
jest.mock('../../feature/global-selection/global-selection.utils');
jest.mock('../utils/validation/validation-helper', () => ({
  ValidationHelper: {
    localeService: {
      getLocale: jest.fn().mockReturnValue('en-US'),
    },
  },
}));

describe('Grid Defaults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constants', () => {
    it('should define defaultRowHeight', () => {
      expect(defaultRowHeight).toBe(42);
    });

    it('should define agTextColumnFilter with expected filter types', () => {
      expect(agTextColumnFilter).toEqual([
        'equals',
        'contains',
        'startsWith',
        'endsWith',
      ]);
    });

    it('should define KeyEventEnum', () => {
      expect(KeyEventEnum.Enter).toBe('Enter');
    });
  });

  describe('Table Default Props', () => {
    it('should have correct default properties', () => {
      expect(tableDefaultProps.stopEditingWhenCellsLoseFocus).toBe(true);
      expect(tableDefaultProps.suppressColumnVirtualisation).toBe(true);
      expect(tableDefaultProps.rowHeight).toBe(defaultRowHeight);
      expect(tableDefaultProps.headerHeight).toBe(54);
      expect(tableDefaultProps.components).toBeDefined();
      expect(tableDefaultProps.defaultColDef).toBeDefined();
      expect(tableDefaultProps.defaultColDef?.menuTabs).toEqual([
        'filterMenuTab',
        'generalMenuTab',
      ]);
    });
  });

  describe('Sidebar Configuration', () => {
    it('should configure columnSideBar correctly', () => {
      expect(columnSideBar.id).toBe('columns');
      expect(columnSideBar.labelDefault).toBe('Columns');
      expect(columnSideBar.toolPanel).toBe('agColumnsToolPanel');
      expect(columnSideBar.toolPanelParams).toBeDefined();
      expect(columnSideBar.toolPanelParams.suppressRowGroups).toBe(true);
    });

    it('should have two panels in sideBar', () => {
      expect(sideBar.toolPanels.length).toBe(2);
      expect(sideBar.toolPanels[0]).toBe(columnSideBar);
      expect(sideBar.toolPanels[1].id).toBe('filters');
    });
  });

  describe('Table Types', () => {
    it('should define serverSideTableDefaultProps with correct settings', () => {
      expect(serverSideTableDefaultProps.rowModelType).toBe('serverSide');
      expect(serverSideTableDefaultProps.maxBlocksInCache).toBe(200);
      expect(serverSideTableDefaultProps.blockLoadDebounceMillis).toBe(50);
    });

    it('should extend tableDefaultProps in clientSideTableDefaultProps', () => {
      expect(clientSideTableDefaultProps).toEqual(
        expect.objectContaining(tableDefaultProps)
      );
    });
  });

  describe('getDefaultColumn', () => {
    it('should return a column definition with default values', () => {
      const column = getDefaultColumn();

      expect(column.cellRenderer).toBeUndefined();
      expect(column.filter).toBe('agTextColumnFilter');
      expect(column.visible).toBe(true);
      expect(column.alwaysVisible).toBe(false);
      expect(column.sortable).toBe(true);
      expect(column.sort).toBeNull();
      expect(column.title).toBe('');
    });
  });

  describe('getDefaultColDef', () => {
    it('should return column definition with text filter by default', () => {
      const colDef = getDefaultColDef('en-US');

      expect(colDef.filterParams).toBeDefined();
      expect(colDef.filterParams.filterOptions).toEqual(agTextColumnFilter);
      expect(colDef.resizable).toBe(true);
      expect(colDef.suppressHeaderMenuButton).toBe(true);
      expect(colDef.suppressHeaderFilterButton).toBe(true);
    });

    it('should return column definition with number filter', () => {
      const colDef = getDefaultColDef('en-US', AgGridFilterType.Number);

      const expectedFilterOptions = [
        'equals',
        'greaterThan',
        'greaterThanOrEqual',
        'lessThan',
        'lessThanOrEqual',
      ];

      expect(colDef.filterParams.filterOptions).toEqual(expectedFilterOptions);
    });

    it('should return column definition with date filter', () => {
      const colDef = getDefaultColDef('en-US', AgGridFilterType.Date);

      const expectedFilterOptions = [
        'equals',
        'greaterThan',
        'greaterThanOrEqual',
        'lessThan',
        'lessThanOrEqual',
      ];

      expect(colDef.filterParams.filterOptions).toEqual(expectedFilterOptions);
    });

    it('should include custom filter params', () => {
      const customParams = { buttons: ['clear', 'apply'] };
      const colDef = getDefaultColDef(
        'en-US',
        AgGridFilterType.Text,
        customParams
      );

      expect(colDef.filterParams.buttons).toEqual(['clear', 'apply']);
    });

    it('should have a numberParser function in filterParams', () => {
      const colDef = getDefaultColDef('en-US');

      expect(typeof colDef.filterParams.numberParser).toBe('function');
      expect(colDef.filterParams.numberParser(null)).toBeNull();
    });
  });

  describe('getCustomTreeDataAutoGroupColumnDef', () => {
    it('should configure tree data with provided parameters', () => {
      const getDataPathMock = jest.fn();
      const autoGroupColDef = { field: 'name', headerName: 'Name' };

      const result = getCustomTreeDataAutoGroupColumnDef({
        autoGroupColumnDef: autoGroupColDef,
        getDataPath: getDataPathMock,
      });

      expect(result.getDataPath).toBe(getDataPathMock);
      expect(result.autoGroupColumnDef).toEqual(
        expect.objectContaining({ field: 'name', headerName: 'Name' })
      );
    });

    it('should handle cell double click to toggle node expansion', () => {
      const config = {
        autoGroupColumnDef: { field: 'group' },
        getDataPath: jest.fn(),
      };

      const result = getCustomTreeDataAutoGroupColumnDef(config);

      const nodeMock = { expanded: false, setExpanded: jest.fn() };
      const params = {
        colDef: { showRowGroup: true },
        node: nodeMock,
      } as unknown as CellDoubleClickedEvent;

      result.onCellDoubleClicked(params);

      expect(nodeMock.setExpanded).toHaveBeenCalledWith(true);
    });

    it('should handle cell key down with Enter key to toggle node expansion', () => {
      const config = {
        autoGroupColumnDef: { field: 'group' },
        getDataPath: jest.fn(),
      };

      const result = getCustomTreeDataAutoGroupColumnDef(config);

      const nodeMock = { expanded: false, setExpanded: jest.fn() };
      const params = {
        colDef: { showRowGroup: true },
        node: nodeMock,
        event: new KeyboardEvent('keydown', { code: 'Enter' }),
      } as unknown as CellKeyDownEvent;

      result.onCellKeyDown(params);

      expect(nodeMock.setExpanded).toHaveBeenCalledWith(true);
    });

    it('should not toggle expansion if key is not Enter', () => {
      const config = {
        autoGroupColumnDef: { field: 'group' },
        getDataPath: jest.fn(),
      };

      const result = getCustomTreeDataAutoGroupColumnDef(config);

      const nodeMock = { expanded: false, setExpanded: jest.fn() };
      const params = {
        colDef: { showRowGroup: true },
        node: nodeMock,
        event: new KeyboardEvent('keydown', { code: 'Space' }),
      } as unknown as CellKeyDownEvent;

      result.onCellKeyDown(params);

      expect(nodeMock.setExpanded).not.toHaveBeenCalled();
    });
  });

  describe('getColFilter', () => {
    it('should return undefined for global selection criteria', () => {
      (
        GlobalSelectionUtils.isGlobalSelectionCriteria as jest.Mock
      ).mockReturnValue(true);

      const filter = getColFilter(
        'globalSelectionCol',
        'agTextColumnFilter',
        {}
      );

      expect(filter).toBeUndefined();
      expect(
        GlobalSelectionUtils.isGlobalSelectionCriteria
      ).toHaveBeenCalledWith('globalSelectionCol');
    });

    it('should return filter if column is filterable', () => {
      (
        GlobalSelectionUtils.isGlobalSelectionCriteria as jest.Mock
      ).mockReturnValue(false);

      const criteriaData = {
        filterableFields: ['price', 'name'],
      };

      const filter = getColFilter(
        'price',
        'agNumberColumnFilter',
        criteriaData
      );

      expect(filter).toBe('agNumberColumnFilter');
    });

    it('should return default text filter if filter not specified for filterable column', () => {
      (
        GlobalSelectionUtils.isGlobalSelectionCriteria as jest.Mock
      ).mockReturnValue(false);

      const criteriaData = {
        filterableFields: ['price', 'name'],
      };

      const filter = getColFilter('price', undefined, criteriaData);

      expect(filter).toBe(AgGridFilterType.Text);
    });

    it('should return undefined for non-filterable column', () => {
      (
        GlobalSelectionUtils.isGlobalSelectionCriteria as jest.Mock
      ).mockReturnValue(false);

      const criteriaData = {
        filterableFields: ['name'],
      };

      const filter = getColFilter(
        'price',
        'agNumberColumnFilter',
        criteriaData
      );

      expect(filter).toBeUndefined();
    });
  });

  describe('refreshGridFilters', () => {
    let mockGridApi: jest.Mocked<GridApi>;

    beforeEach(() => {
      mockGridApi = {
        getFilterModel: jest.fn(),
        setFilterModel: jest.fn(),
      } as unknown as jest.Mocked<GridApi>;
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should refresh filter model after a delay when gridApi is provided', () => {
      const mockFilterModel = { name: { filter: 'test' } };
      mockGridApi.getFilterModel.mockReturnValue(mockFilterModel);

      refreshGridFilters(mockGridApi);

      expect(mockGridApi.getFilterModel).not.toHaveBeenCalled();
      expect(mockGridApi.setFilterModel).not.toHaveBeenCalled();

      jest.advanceTimersByTime(10);

      expect(mockGridApi.getFilterModel).toHaveBeenCalled();
      expect(mockGridApi.setFilterModel).toHaveBeenCalledWith(mockFilterModel);
    });

    it('should not call any methods when gridApi is null', () => {
      refreshGridFilters(null);

      jest.advanceTimersByTime(10);

      expect(mockGridApi.getFilterModel).not.toHaveBeenCalled();
      expect(mockGridApi.setFilterModel).not.toHaveBeenCalled();
    });

    it('should not call any methods when gridApi is undefined', () => {
      refreshGridFilters(undefined as any);

      jest.advanceTimersByTime(10);

      expect(mockGridApi.getFilterModel).not.toHaveBeenCalled();
      expect(mockGridApi.setFilterModel).not.toHaveBeenCalled();
    });

    it('should handle empty filter model', () => {
      const emptyFilterModel = {};
      mockGridApi.getFilterModel.mockReturnValue(emptyFilterModel);

      refreshGridFilters(mockGridApi);
      jest.advanceTimersByTime(10);

      expect(mockGridApi.getFilterModel).toHaveBeenCalled();
      expect(mockGridApi.setFilterModel).toHaveBeenCalledWith(emptyFilterModel);
    });
  });
});
