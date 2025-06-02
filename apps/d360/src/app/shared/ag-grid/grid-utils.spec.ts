import { GridApi } from 'ag-grid-enterprise';

import {
  applyColumnSettings,
  ensureEmptyRowAtBottom,
  getColumnSettingsFromGrid,
  resetGrid,
  showFloatingFilters,
} from './grid-utils';

describe('Grid Utils', () => {
  let mockGridApi: jest.Mocked<GridApi>;

  beforeEach(() => {
    mockGridApi = {
      getColumnDefs: jest.fn(),
      setGridOption: jest.fn(),
      refreshHeader: jest.fn(),
      getColumnState: jest.fn(),
      applyColumnState: jest.fn(),
      getDisplayedRowCount: jest.fn(),
      getDisplayedRowAtIndex: jest.fn(),
      applyTransaction: jest.fn(),
    } as unknown as jest.Mocked<GridApi>;
  });

  describe('showFloatingFilters', () => {
    it('should update column definitions with floating filter visibility and refresh header', () => {
      const columnDefs = [{ field: 'name' }, { field: 'age' }];
      mockGridApi.getColumnDefs.mockReturnValue(columnDefs);

      showFloatingFilters(mockGridApi, true);

      expect(mockGridApi.setGridOption).toHaveBeenCalledWith(
        'columnDefs',
        columnDefs.map((col) => ({ ...col, floatingFilter: true }))
      );
      expect(mockGridApi.refreshHeader).toHaveBeenCalled();
    });

    it('should not update column definitions if getColumnDefs returns null', () => {
      mockGridApi.getColumnDefs.mockReturnValue(null);

      showFloatingFilters(mockGridApi, false);

      expect(mockGridApi.setGridOption).not.toHaveBeenCalled();
      expect(mockGridApi.refreshHeader).toHaveBeenCalled();
    });
  });

  describe('getColumnSettingsFromGrid', () => {
    it('should return column settings from grid state', () => {
      const columnState = [
        { colId: 'name', hide: false },
        { colId: 'age', hide: true },
      ];
      mockGridApi.getColumnState.mockReturnValue(columnState);

      const result = getColumnSettingsFromGrid(mockGridApi);

      expect(result).toEqual([
        { colId: 'name', visible: true },
        { colId: 'age', visible: false },
      ]);
    });
  });

  describe('applyColumnSettings', () => {
    it('should apply column settings to grid', () => {
      const columnSettings = [
        { colId: 'name', visible: true, sort: 'asc' },
        { colId: 'age', visible: false },
      ] as any;

      applyColumnSettings(mockGridApi, columnSettings);

      expect(mockGridApi.applyColumnState).toHaveBeenCalledWith({
        state: [
          { colId: 'name', hide: false, sort: 'asc' },
          { colId: 'age', hide: true, sort: null },
        ],
        applyOrder: true,
      });
    });
  });

  describe('resetGrid', () => {
    it('should reset grid with empty row data', () => {
      resetGrid(mockGridApi);

      expect(mockGridApi.setGridOption).toHaveBeenCalledWith('rowData', [{}]);
    });

    it('should do nothing if gridApi is falsy', () => {
      resetGrid(null as unknown as GridApi);

      expect(mockGridApi.setGridOption).not.toHaveBeenCalled();
    });
  });

  describe('ensureEmptyRowAtBottom', () => {
    it('should add empty row when last row has data', () => {
      mockGridApi.getDisplayedRowCount.mockReturnValue(2);
      mockGridApi.getDisplayedRowAtIndex.mockReturnValue({
        data: { name: 'John', age: 30 },
      } as any);

      ensureEmptyRowAtBottom(mockGridApi);

      expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
        addIndex: 2,
        add: [{}],
      });
    });

    it('should add empty row when there are no rows', () => {
      mockGridApi.getDisplayedRowCount.mockReturnValue(0);
      mockGridApi.getDisplayedRowAtIndex.mockReturnValue(undefined as any);

      ensureEmptyRowAtBottom(mockGridApi);

      expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
        addIndex: 0,
        add: [{}],
      });
    });

    it('should not add empty row when last row is already empty', () => {
      mockGridApi.getDisplayedRowCount.mockReturnValue(2);
      mockGridApi.getDisplayedRowAtIndex.mockReturnValue({
        data: {},
      } as any);

      ensureEmptyRowAtBottom(mockGridApi);

      expect(mockGridApi.applyTransaction).not.toHaveBeenCalled();
    });
  });
});
