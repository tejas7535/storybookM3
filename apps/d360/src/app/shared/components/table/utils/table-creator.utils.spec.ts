import { ColDef } from 'ag-grid-enterprise';

import {
  ExtendedColumnDefs,
  NamedColumnDefs,
  ServerSideAutoGroupProps,
  TableConfig,
} from '../interfaces';
import { TableCreator } from './table-creator.utils';

describe('TableCreator', () => {
  describe('get', () => {
    it('should return a DynamicTable with default values when no table is provided', () => {
      const result = TableCreator.get({
        table: null,
        isLoading$: null,
        showLoaderForInfiniteScroll: false,
        hasTabView: false,
        maxAllowedTabs: 5,
        tableClass: null,
        callbacks: null,
        hasToolbar: null,
        renderFloatingFilter: null,
        customOnResetFilters: null,
        customGetFilterCount: null,
      });

      expect(result.table).toBeDefined();
      expect(result.tableClass).toBe('grow');
      expect(result.hasToolbar).toBe(true);
      expect(result.renderFloatingFilter).toBe(true);
    });

    it('should return a DynamicTable with provided values', () => {
      const mockTable = { columnDefs: [] as any, tableId: 'testTable' };
      const result = TableCreator.get({
        table: mockTable,
        isLoading$: null,
        showLoaderForInfiniteScroll: true,
        hasTabView: true,
        maxAllowedTabs: 10,
        tableClass: 'custom-class',
        callbacks: { onGridReady: jest.fn() },
        hasToolbar: false,
        renderFloatingFilter: false,
        customOnResetFilters: jest.fn(),
        customGetFilterCount: jest.fn(),
      });

      expect(result.table).toBe(mockTable);
      expect(result.tableClass).toBe('custom-class');
      expect(result.hasToolbar).toBe(false);
      expect(result.renderFloatingFilter).toBe(false);
      expect(result.showLoaderForInfiniteScroll).toBe(true);
      expect(result.hasTabView).toBe(true);
      expect(result.maxAllowedTabs).toBe(10);
    });
  });

  describe('getTable', () => {
    it('should return a TableConfig with default values when no defaultColDef is provided', () => {
      const mockTableConfig: TableConfig = {
        columnDefs: [],
        tableId: 'testTable',
      };

      const result = TableCreator.getTable(mockTableConfig);

      expect(result.defaultColDef).toEqual({
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
      });
      expect(result.loadingMessage).toBe('');
      expect(result.noRowsMessage).toBe('hint.noData');
    });

    it('should return a TableConfig with provided values', () => {
      const mockTableConfig: TableConfig = {
        columnDefs: [],
        tableId: 'testTable',
        defaultColDef: { menuTabs: ['columnsMenuTab'] } as ColDef,
        loadingMessage: 'loading...',
        noRowsMessage: 'no data available',
      };

      const result = TableCreator.getTable(mockTableConfig);

      expect(result.defaultColDef).toEqual({ menuTabs: ['columnsMenuTab'] });
      expect(result.loadingMessage).toBe('loading...');
      expect(result.noRowsMessage).toBe('no data available');
    });
  });

  describe('getServerSideAutoGroup', () => {
    it('should return the provided server-side auto group configuration', () => {
      const mockAutoGroupConfig: ServerSideAutoGroupProps = {
        autoGroupColumnDef: { headerName: 'Group' },
        isServerSideGroup: jest.fn(),
        getServerSideGroupKey: jest.fn(),
        isServerSideGroupOpenByDefault: jest.fn().mockReturnValue(true),
      };

      const result = TableCreator.getServerSideAutoGroup(mockAutoGroupConfig);

      expect(result).toEqual(mockAutoGroupConfig);
      expect(result.isServerSideGroupOpenByDefault).toBe(
        mockAutoGroupConfig.isServerSideGroupOpenByDefault
      );
    });

    it('should use the default value for isServerSideGroupOpenByDefault if not provided', () => {
      const mockAutoGroupConfig: ServerSideAutoGroupProps = {
        autoGroupColumnDef: { headerName: 'Group' },
        isServerSideGroup: jest.fn(),
        getServerSideGroupKey: jest.fn(),
      };

      const result = TableCreator.getServerSideAutoGroup(mockAutoGroupConfig);

      expect(result.isServerSideGroupOpenByDefault(null)).toBe(false);
    });
  });

  describe('toNamedColumnDefs', () => {
    it('should return the input as NamedColumnDefs if it already contains layoutId, title, and columnDefs', () => {
      const mockNamedColumnDefs: NamedColumnDefs[] = [
        {
          layoutId: 1,
          title: 'Test Layout',
          columnDefs: [{ colId: 'col1', headerName: 'Column 1' }],
        },
      ];

      const result = TableCreator['toNamedColumnDefs'](mockNamedColumnDefs);

      expect(result).toEqual(mockNamedColumnDefs);
    });

    it('should convert ExtendedColumnDefs to NamedColumnDefs with default layoutId and title', () => {
      const mockExtendedColumnDefs: ExtendedColumnDefs[] = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      const result = TableCreator['toNamedColumnDefs'](mockExtendedColumnDefs);

      expect(result).toEqual([
        {
          layoutId: 0,
          title: 'table.defaultTab',
          columnDefs: mockExtendedColumnDefs,
        },
      ]);
    });

    it('should handle an empty array gracefully', () => {
      const result = TableCreator['toNamedColumnDefs']([]);

      expect(result).toEqual([
        {
          layoutId: 0,
          title: 'table.defaultTab',
          columnDefs: [],
        },
      ]);
    });
  });
});
