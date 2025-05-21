import { fakeAsync, tick } from '@angular/core/testing';

import { of, take, throwError } from 'rxjs';

import { ColDef, ColumnState } from 'ag-grid-enterprise';

import { Stub } from '../../../test/stub.class';
import { IconType } from '../enums';
import { ColumnSetting, NamedColumnDefs, TableSetting } from '../interfaces';
import { TableService } from './table.service';

describe('TableService', () => {
  let service: TableService<string>;

  beforeEach(() => {
    service = Stub.get<TableService<string>>({
      component: TableService,
    });

    service['_gridApi'] = Stub.getGridApi();
    service['_columnDefinitions'] = [];
  });

  describe('tableId', () => {
    it('should return the tableId if it is set', () => {
      (service as any)._tableId = 'testTableId';
      expect((service as any).tableId).toBe('testTableId');
    });

    it('should throw an error if tableId is not set', () => {
      (service as any)._tableId = undefined;
      expect(() => (service as any).tableId).toThrow(
        '[TableWrapper] Table ID was not set. Please set the table ID before using it.'
      );
    });
  });

  describe('columnDefinitions', () => {
    it('should return the columnDefinitions if they are set', () => {
      const mockColumnDefinitions: NamedColumnDefs[] = [
        { layoutId: 1, title: 'Test Layout', columnDefs: [] },
      ];
      (service as any)._columnDefinitions = mockColumnDefinitions;

      expect((service as any).columnDefinitions).toBe(mockColumnDefinitions);
    });

    it('should throw an error if columnDefinitions are not set', () => {
      (service as any)._columnDefinitions = undefined;
      expect(() => (service as any).columnDefinitions).toThrow(
        '[TableWrapper] Column definitions were not set. Please set the column definitions before using it.'
      );
    });
  });

  describe('gridApi', () => {
    it('should return the gridApi if it is set', () => {
      const mockGridApi = Stub.getGridApi();
      (service as any)._gridApi = mockGridApi;

      expect((service as any).gridApi).toBe(mockGridApi);
    });

    it('should throw an error if gridApi is not set', () => {
      (service as any)._gridApi = undefined;
      expect(() => (service as any).gridApi).toThrow(
        '[TableWrapper] Grid API was not set. Please set the grid API before using it.'
      );
    });
  });

  describe('init', () => {
    it('should initialize table settings and load settings from the backend', () => {
      const mockTableId = 'testTableId';
      const mockColumnDefinitions: NamedColumnDefs[] = [
        { layoutId: 1, title: 'Test Layout', columnDefs: [] },
      ];
      const mockGridApi = Stub.getGridApi();

      const loadTableSettingsSpy = jest
        .spyOn<any, any>(service, 'loadTableSettings$')
        .mockReturnValue(of([]));
      const httpPostSpy = jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(of(null));

      service.init({
        tableId: mockTableId,
        columnDefinitions: mockColumnDefinitions,
        gridApi: mockGridApi,
        maxAllowedTabs: 5,
      });

      expect(service['tableId']).toBe(mockTableId);
      expect(service['columnDefinitions']).toBe(mockColumnDefinitions);
      expect(service['gridApi']).toBe(mockGridApi);
      expect(loadTableSettingsSpy).toHaveBeenCalled();
      expect(httpPostSpy).not.toHaveBeenCalled(); // No data to save initially
    });

    it('should save table settings to the backend when dataToSave$ emits', fakeAsync(() => {
      const mockTableId = 'testTableId';
      const mockColumnDefinitions: NamedColumnDefs[] = [
        { layoutId: 1, title: 'Test Layout', columnDefs: [] },
      ];
      const mockGridApi = Stub.getGridApi();

      const mockTableSettings = [
        { id: 1, layoutId: 1, active: true, title: 'Test', columns: [] as any },
      ];

      jest
        .spyOn<any, any>(service, 'loadTableSettings$')
        .mockReturnValue(of([]));
      const httpPostSpy = jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(of(null));

      service.init({
        tableId: mockTableId,
        columnDefinitions: mockColumnDefinitions,
        gridApi: mockGridApi,
        maxAllowedTabs: 5,
      });

      service['dataToSave$'].next(mockTableSettings as any);

      tick(100);

      expect(httpPostSpy).toHaveBeenCalledWith(
        `${service['URL']}${mockTableId}`,
        mockTableSettings
      );
    }));

    it('should handle backend errors gracefully when saving table settings', fakeAsync(() => {
      const mockTableId = 'testTableId';
      const mockColumnDefinitions: NamedColumnDefs[] = [
        { layoutId: 1, title: 'Test Layout', columnDefs: [] },
      ];
      const mockGridApi = Stub.getGridApi();

      const mockTableSettings = [
        { id: 1, layoutId: 1, active: true, title: 'Test', columns: [] as any },
      ];

      jest
        .spyOn<any, any>(service, 'loadTableSettings$')
        .mockReturnValue(of([]));
      const httpPostSpy = jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(throwError(() => new Error('Backend error')));

      service.init({
        tableId: mockTableId,
        columnDefinitions: mockColumnDefinitions,
        gridApi: mockGridApi,
        maxAllowedTabs: 5,
      });

      service['dataToSave$'].next(mockTableSettings as any);

      tick(100);

      expect(httpPostSpy).toHaveBeenCalledWith(
        `${service['URL']}${mockTableId}`,
        mockTableSettings
      );
    }));
  });

  describe('setTableSettings$', () => {
    it('should update table settings and emit new data', (done) => {
      const mockColumnState: ColumnState[] = [
        { colId: 'col1', hide: false, sort: 'asc' },
        { colId: 'col2', hide: true, sort: null },
      ];

      const mockFilterModel = {
        col1: {
          filterType: 'text',
          filter: 'filter1',
        },
      };

      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 1,
          active: true,
          title: 'Test Layout',
          defaultSetting: true,
          disabled: false,
          icons: [],
          columns: [],
        },
      ];

      jest
        .spyOn(service['gridApi'], 'getColumnState')
        .mockReturnValue(mockColumnState);
      jest
        .spyOn(service['gridApi'], 'getFilterModel')
        .mockReturnValue(mockFilterModel);

      const dataToSaveSpy = jest.spyOn(service['dataToSave$'], 'next');
      const tableSettingsSpy = jest.spyOn(service['tableSettings$'], 'next');

      service['tableSettings$'].next(mockTableSettings);

      service
        .setTableSettings$(1)
        .pipe(take(1))
        .subscribe(() => {
          expect(dataToSaveSpy).toHaveBeenCalledWith([
            {
              id: 1,
              layoutId: 1,
              active: true,
              title: 'Test Layout',
              defaultSetting: true,
              disabled: false,
              icons: [],
              columns: [
                {
                  colId: 'col1',
                  visible: true,
                  sort: 'asc',
                  filter: {
                    filter: 'filter1',
                    filterType: 'text',
                  },
                },
                {
                  colId: 'col2',
                  visible: false,
                  sort: null,
                  filter: undefined,
                },
              ],
            },
          ]);

          expect(tableSettingsSpy).toHaveBeenCalledWith([
            {
              id: 1,
              layoutId: 1,
              active: true,
              title: 'Test Layout',
              defaultSetting: true,
              disabled: false,
              icons: [],
              columns: [
                {
                  colId: 'col1',
                  visible: true,
                  sort: 'asc',
                  filter: {
                    filter: 'filter1',
                    filterType: 'text',
                  },
                },
                {
                  colId: 'col2',
                  visible: false,
                  sort: null,
                  filter: undefined,
                },
              ],
            },
          ]);

          done();
        });
    });

    it('should use the default setting if no matching index is found', (done) => {
      const mockColumnState: ColumnState[] = [
        { colId: 'col1', hide: false, sort: 'asc' },
      ];

      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 2,
          layoutId: 1,
          active: false,
          title: 'Default Layout',
          defaultSetting: true,
          disabled: false,
          icons: [],
          columns: [],
        },
      ];

      jest
        .spyOn(service['gridApi'], 'getColumnState')
        .mockReturnValue(mockColumnState);

      service['tableSettings$'].next(mockTableSettings);

      const dataToSaveSpy = jest.spyOn(service['dataToSave$'], 'next');
      const tableSettingsSpy = jest.spyOn(service['tableSettings$'], 'next');

      service
        .setTableSettings$(1)
        .pipe(take(1))
        .subscribe(() => {
          expect(dataToSaveSpy).toHaveBeenCalledWith([
            {
              id: 2,
              layoutId: 1,
              active: false,
              title: 'Default Layout',
              defaultSetting: true,
              disabled: false,
              icons: [],
              columns: [
                {
                  colId: 'col1',
                  visible: true,
                  sort: 'asc',
                  filter: undefined,
                },
              ],
            },
          ]);

          expect(tableSettingsSpy).toHaveBeenCalledWith([
            {
              id: 2,
              layoutId: 1,
              active: false,
              title: 'Default Layout',
              defaultSetting: true,
              disabled: false,
              icons: [],
              columns: [
                {
                  colId: 'col1',
                  visible: true,
                  sort: 'asc',
                  filter: undefined,
                },
              ],
            },
          ]);

          done();
        });
    });
  });

  describe('mapToTableSettings', () => {
    it('should map valid table settings correctly', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [{ name: IconType.Edit, disabled: false }],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: 'asc',
              filterModel: null,
              filter: 'filter1',
            },
          ],
        },
      ];

      const result = service['mapToTableSettings'](mockTableSettings);

      expect(result).toEqual([
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [{ name: IconType.Edit, disabled: false }],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: 'asc',
              filterModel: null,
              filter: 'filter1',
            },
          ],
        },
      ]);
    });

    it('should filter out settings with invalid IDs', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: -1,
          layoutId: 2,
          active: false,
          title: '',
          disabled: false,
          defaultSetting: false,
          icons: [],
          columns: [],
        },
        {
          id: 1,
          layoutId: 3,
          active: true,
          title: 'Valid Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: [],
        },
      ];

      const result = service['mapToTableSettings'](mockTableSettings);

      expect(result).toEqual([
        {
          id: 1,
          layoutId: 3,
          active: true,
          title: 'Valid Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: [],
        },
      ]);
    });

    it('should apply default icons if none are provided', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: false,
          title: '',
          disabled: false,
          defaultSetting: false,
          icons: [{ name: IconType.Edit }, { name: IconType.Delete }],
          columns: [],
        },
      ];

      const result = service['mapToTableSettings'](mockTableSettings);

      expect(result[0].icons).toEqual([
        { name: IconType.Edit, disabled: false },
        { name: IconType.Delete, disabled: false },
      ]);
    });

    it('should apply default values for missing properties', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: undefined,
          active: undefined,
          title: undefined,
          disabled: undefined,
          defaultSetting: undefined,
          icons: undefined,
          columns: [
            {
              colId: 'col1',
              visible: undefined,
              sort: undefined,
              filterModel: undefined,
              filter: undefined,
            },
          ],
        },
      ];

      const result = service['mapToTableSettings'](mockTableSettings);

      expect(result).toEqual([
        {
          id: 1,
          layoutId: 0,
          active: false,
          title: '',
          disabled: false,
          defaultSetting: false,
          icons: [{ name: IconType.Edit }, { name: IconType.Delete }],
          columns: [
            {
              colId: 'col1',
              visible: false,
              sort: null,
              filterModel: null,
              filter: null,
            },
          ],
        },
      ]);
    });
  });

  describe('loadTableSettings$', () => {
    beforeEach(() => {
      service['_tableId'] = 'testTableId';
      service['_columnDefinitions'] = [];
    });

    it('should load table settings from the backend and map them correctly and to add missing defaults', (done) => {
      service['_columnDefinitions'] = [
        { layoutId: 1, title: 'Test Layout', columnDefs: [] },
        { layoutId: 2, title: 'Another Layout', columnDefs: [] },
      ];

      const mockResponse: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 1,
          active: true,
          title: 'Test Layout',
          defaultSetting: true,
          disabled: false,
          icons: [{ name: IconType.Edit, disabled: false }],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: 'asc',
              filterModel: null,
              filter: null,
            },
          ],
        },
      ];

      jest.spyOn(service['http'], 'get').mockReturnValue(of(mockResponse));
      const mapToTableSettingsSpy = jest.spyOn<any, any>(
        service,
        'mapToTableSettings'
      );
      const applyColumnSettingsSpy = jest.spyOn<any, any>(
        service,
        'applyColumnSettings'
      );
      const tableSettingsSpy = jest.spyOn(service['tableSettings$'], 'next');

      service['loadTableSettings$']()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual([
            ...mockResponse,
            {
              active: false,
              columns: [],
              defaultSetting: true,
              disabled: false,
              icons: [
                {
                  disabled: true,
                  name: 'lock',
                },
              ],
              id: 2,
              layoutId: 2,
              title: 'Another Layout',
            },
            {
              id: service['addId'],
              active: false,
              defaultSetting: false,
              disabled: false,
              icons: [{ name: IconType.Add }],
              columns: [],
            },
          ]);

          expect(mapToTableSettingsSpy).toHaveBeenCalled();
          expect(applyColumnSettingsSpy).toHaveBeenCalled();
          expect(tableSettingsSpy).toHaveBeenCalled();
          done();
        });
    });

    it('should handle an empty response and create default settings', (done) => {
      jest.spyOn(service['http'], 'get').mockReturnValue(of([]));
      const tableSettingsSpy = jest.spyOn(service['tableSettings$'], 'next');

      service['loadTableSettings$']()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual([
            {
              id: service['addId'],
              active: false,
              disabled: false,
              defaultSetting: false,
              icons: [{ name: IconType.Add }],
              columns: [],
            },
          ]);

          expect(tableSettingsSpy).toHaveBeenCalled();
          done();
        });
    });

    it('should handle backend errors gracefully and return default settings', (done) => {
      jest
        .spyOn(service['http'], 'get')
        .mockReturnValue(throwError(() => new Error('Backend error')));
      const tableSettingsSpy = jest.spyOn(service['tableSettings$'], 'next');

      service['loadTableSettings$']()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual([
            {
              id: service['addId'],
              active: false,
              defaultSetting: false,
              disabled: false,
              icons: [{ name: IconType.Add }],
              columns: [],
            },
          ]);

          expect(tableSettingsSpy).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('getMissingDefaults', () => {
    const mockColumnDefinitions: NamedColumnDefs[] = [
      { layoutId: 1, title: 'Layout 1', columnDefs: [] },
      { layoutId: 2, title: 'Layout 2', columnDefs: [] },
      { layoutId: 3, title: 'Layout 3', columnDefs: [] },
    ];

    beforeEach(() => {
      service['_columnDefinitions'] = mockColumnDefinitions;
    });

    it('should return all default IDs when settings are null', () => {
      const result = service['getMissingDefaults'](null);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return all default IDs when settings are empty array', () => {
      const result = service['getMissingDefaults']([]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return all default IDs when no settings have defaultSetting=true', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: false, columns: [] },
        { id: 102, layoutId: 2, defaultSetting: false, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return only missing layout IDs when some default settings are present', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: 3, defaultSetting: true, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2]);
    });

    it('should return empty array when all default layoutIds are present', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: 2, defaultSetting: true, columns: [] },
        { id: 103, layoutId: 3, defaultSetting: true, columns: [] },
        { id: 104, layoutId: 4, defaultSetting: false, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([]);
    });

    it('should handle case when settings have layoutIds not in column definitions', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: 5, defaultSetting: true, columns: [] }, // Not in column definitions
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2, 3]);
    });

    it('should treat settings with undefined layoutId correctly', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, defaultSetting: true, columns: [] }, // Undefined layoutId
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2, 3]);
    });
  });

  describe('applyColumnSettings', () => {
    it('should apply column settings and return sorted column definitions', () => {
      const mockColumnDefinitions: (ColumnSetting<string> & ColDef)[] = [
        { colId: 'col1', alwaysVisible: false, order: 0 },
        { colId: 'col2', alwaysVisible: true, order: 0 },
        { colId: 'col3', alwaysVisible: false, order: 0 },
      ] as any;

      const mockColumnSettings: ColumnSetting<string>[] = [
        { colId: 'col3', visible: true, sort: 'asc', filter: 'filter3' },
        { colId: 'col1', visible: false, sort: null, filter: null },
      ];

      const result = service['applyColumnSettings'](
        mockColumnDefinitions,
        mockColumnSettings
      );

      expect(result).toEqual([
        {
          colId: 'col3',
          alwaysVisible: false,
          order: 0,
          visible: true,
          sort: 'asc',
          filterModel: 'filter3',
        },
        {
          colId: 'col1',
          alwaysVisible: false,
          order: 1,
          visible: false,
          sort: null,
          filterModel: null,
        },
        {
          colId: 'col2',
          alwaysVisible: true,
          order: 3,
        },
      ]);
    });

    it('should handle column settings with missing columns gracefully', () => {
      const mockColumnDefinitions: (ColumnSetting<string> & ColDef)[] = [
        { colId: 'col1', alwaysVisible: false, order: 0 },
        { colId: 'col2', alwaysVisible: true, order: 0 },
      ] as any;

      const mockColumnSettings: ColumnSetting<string>[] = [
        { colId: 'col3', visible: true, sort: 'asc', filter: 'filter3' },
      ];

      const result = service['applyColumnSettings'](
        mockColumnDefinitions,
        mockColumnSettings
      );

      expect(result).toEqual([
        {
          colId: 'col1',
          alwaysVisible: false,
          order: 1,
        },
        {
          colId: 'col2',
          alwaysVisible: true,
          order: 2,
        },
      ]);
    });

    it('should handle empty column settings and return default column definitions', () => {
      const mockColumnDefinitions: (ColumnSetting<string> & ColDef)[] = [
        { colId: 'col1', alwaysVisible: false, order: 0 },
        { colId: 'col2', alwaysVisible: true, order: 0 },
      ] as any;

      const result = service['applyColumnSettings'](mockColumnDefinitions, []);

      expect(result).toEqual([
        {
          colId: 'col1',
          alwaysVisible: false,
          order: 0,
        },
        {
          colId: 'col2',
          alwaysVisible: true,
          order: 1,
        },
      ]);
    });
  });
});
