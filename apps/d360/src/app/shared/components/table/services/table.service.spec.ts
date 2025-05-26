import { fakeAsync, tick } from '@angular/core/testing';

import { of, take, throwError } from 'rxjs';

import { ColumnState } from 'ag-grid-enterprise';

import { Stub } from '../../../test/stub.class';
import { IconType } from '../enums';
import { NamedColumnDefs, TableSetting } from '../interfaces';
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

    it('should filter out the add tab during dataToSave$', (done) => {
      service['_tableId'] = 'testTableId';
      service['maxAllowedTabs'] = 5;

      const mockTableSettings = [
        { id: 1, layoutId: 1, active: true, title: 'Test', columns: [] },
        {
          id: TableService.addId,
          active: false,
          defaultSetting: false,
          columns: [],
        },
      ] as any;
      jest
        .spyOn<any, any>(service, 'loadTableSettings$')
        .mockReturnValue(of([]));

      const httpPostSpy = jest
        .spyOn(service['http'], 'post')
        .mockReturnValue(of(null));

      // Initialize the service first
      service.init({
        tableId: 'testTableId',
        columnDefinitions: [
          { layoutId: 1, title: 'Test Layout', columnDefs: [] },
        ],
        gridApi: Stub.getGridApi(),
        maxAllowedTabs: 5,
      });

      // Then emit data to save
      service['dataToSave$'].next(mockTableSettings);

      // Wait for debounce time
      setTimeout(() => {
        expect(httpPostSpy).toHaveBeenCalledWith(
          `${service['URL']}${service['_tableId']}`,
          [{ id: 1, layoutId: 1, active: true, title: 'Test', columns: [] }]
        );
        done();
      }, 200);
    });
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
              id: TableService.addId,
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
              id: TableService.addId,
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

    it('should add all default settings when the backend returns an empty array', (done) => {
      service['_columnDefinitions'] = [
        { layoutId: 1, title: 'Layout 1', columnDefs: [] },
        { layoutId: 2, title: 'Layout 2', columnDefs: [] },
      ];

      jest.spyOn(service['http'], 'get').mockReturnValue(of([]));

      service['loadTableSettings$']()
        .pipe(take(1))
        .subscribe((response) => {
          // Should contain 2 default settings + 1 add tab
          expect(response.length).toBe(3);

          // Verify default settings are created correctly
          const defaultSettings = response.filter(
            (setting) => setting.id !== TableService.addId
          );
          expect(defaultSettings.length).toBe(2);

          // Check first default setting
          expect(defaultSettings[0].layoutId).toBe(1);
          expect(defaultSettings[0].title).toBe('Layout 1');
          expect(defaultSettings[0].defaultSetting).toBe(true);
          expect(defaultSettings[0].active).toBe(false);
          expect(defaultSettings[0].disabled).toBe(false);
          expect(defaultSettings[0].icons.length).toBe(1);
          expect(defaultSettings[0].icons[0].name).toBe('lock');
          expect(defaultSettings[0].icons[0].disabled).toBe(true);

          // Check second default setting
          expect(defaultSettings[1].layoutId).toBe(2);
          expect(defaultSettings[1].title).toBe('Layout 2');
          expect(defaultSettings[1].defaultSetting).toBe(true);

          // Verify add tab is present
          const addTab = response.find((tab) => tab.id === TableService.addId);
          expect(addTab).toBeDefined();
          expect(addTab.icons[0].name).toBe(IconType.Add);

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
              id: TableService.addId,
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

    describe('sorting logic', () => {
      beforeEach(() => {
        service['_columnDefinitions'] = [
          { layoutId: 1, title: 'Test Layout', columnDefs: [] },
        ];
      });

      it('should sort table settings with defaultSetting=true first', (done) => {
        const mockSettings: TableSetting<string>[] = [
          { id: 1, layoutId: 1, defaultSetting: false, columns: [] },
          { id: 2, layoutId: 1, defaultSetting: true, columns: [] },
          { id: 3, layoutId: 1, defaultSetting: false, columns: [] },
        ] as any;

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockSettings));
        jest
          .spyOn(service, 'applyColumnSettings' as any)
          .mockImplementation((_columnDefs, settings) => settings);

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe(() => {
            const settings = service['tableSettings$'].getValue();

            // Filter out the add tab
            const filteredSetting = settings.find(
              (tab) => tab.id !== TableService.addId
            );

            // First item should be the default setting
            expect(filteredSetting.defaultSetting).toBe(true);
            expect(filteredSetting.id).toBe(2);

            done();
          });
      });

      it('should sort by id when multiple items have the same defaultSetting value', (done) => {
        const mockSettings: TableSetting<string>[] = [
          { id: 3, layoutId: 1, defaultSetting: false, columns: [] },
          { id: 1, layoutId: 1, defaultSetting: false, columns: [] },
          { id: 4, layoutId: 1, defaultSetting: true, columns: [] },
          { id: 2, layoutId: 1, defaultSetting: true, columns: [] },
        ] as any;

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockSettings));
        jest
          .spyOn(service, 'applyColumnSettings' as any)
          .mockImplementation((_columnDefs, settings) => settings);

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe(() => {
            const settings = service['tableSettings$'].getValue();

            // Filter out the add tab
            const filteredSettings = settings.filter(
              (tab) => tab.id !== TableService.addId
            );

            // First two items should be default settings sorted by id
            expect(filteredSettings[0].defaultSetting).toBe(true);
            expect(filteredSettings[0].id).toBe(2);

            expect(filteredSettings[1].defaultSetting).toBe(true);
            expect(filteredSettings[1].id).toBe(4);

            // Next two items should be non-default settings sorted by id
            expect(filteredSettings[2].defaultSetting).toBe(false);
            expect(filteredSettings[2].id).toBe(1);

            expect(filteredSettings[3].defaultSetting).toBe(false);
            expect(filteredSettings[3].id).toBe(3);

            done();
          });
      });
    });

    describe('with maxAllowedTabs', () => {
      beforeEach(() => {
        service['_columnDefinitions'] = [
          { layoutId: 1, title: 'Test Layout', columnDefs: [] },
        ];
      });

      it('should disable the add button when maximum tabs are reached', (done) => {
        service['maxAllowedTabs'] = 2;

        const mockSettings: TableSetting<string>[] = [
          { id: 1, layoutId: 1, defaultSetting: true, columns: [] },
          { id: 2, layoutId: 1, defaultSetting: false, columns: [] },
          { id: 3, layoutId: 1, defaultSetting: false, columns: [] },
        ] as any;

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockSettings));

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe((response) => {
            const addTab = response.find(
              (tab) => tab.id === TableService.addId
            );
            expect(addTab.disabled).toBe(true);
            done();
          });
      });

      it('should not count default settings towards maxAllowedTabs', (done) => {
        service['maxAllowedTabs'] = 2;

        const mockSettings: TableSetting<string>[] = [
          { id: 1, layoutId: 1, defaultSetting: true, columns: [] },
          { id: 2, layoutId: 1, defaultSetting: true, columns: [] },
          { id: 3, layoutId: 1, defaultSetting: false, columns: [] },
        ] as any;

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockSettings));

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe((response) => {
            const addTab = response.find(
              (tab) => tab.id === TableService.addId
            );
            expect(addTab.disabled).toBe(false);
            done();
          });
      });

      it('should disable the add button when maxAllowedTabs is 0 or negative', (done) => {
        service['maxAllowedTabs'] = 0;

        const mockSettings: TableSetting<string>[] = [
          { id: 1, layoutId: 1, defaultSetting: true, columns: [] },
        ] as any;

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockSettings));

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe((response) => {
            const addTab = response.find(
              (tab) => tab.id === TableService.addId
            );
            expect(addTab.disabled).toBe(true);
            done();
          });
      });
    });

    describe('handling renamed column definitions', () => {
      it('should update default setting title when column definition title has changed', (done) => {
        // Define column definitions with a specific title
        service['_columnDefinitions'] = [
          { layoutId: 1, title: 'New Layout Title', columnDefs: [] },
        ];

        // Mock response where the default setting has an old/different title
        const mockResponse: TableSetting<string>[] = [
          {
            id: 1,
            layoutId: 1,
            active: true,
            title: 'Old Layout Title',
            defaultSetting: true,
            disabled: false,
            icons: [],
            columns: [],
          },
        ];

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockResponse));
        jest
          .spyOn(service, 'applyColumnSettings' as any)
          .mockImplementation((_columnDefs, settings) => settings);

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe(() => {
            const settings = service['tableSettings$'].getValue();

            // Find the default setting
            const defaultSetting = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 1
            );

            // Verify title was updated to match the column definition
            expect(defaultSetting.title).toBe('New Layout Title');
            done();
          });
      });

      it('should not update default setting title when column definition title is the same', (done) => {
        service['_columnDefinitions'] = [
          { layoutId: 1, title: 'Same Title', columnDefs: [] },
        ];

        const mockResponse: TableSetting<string>[] = [
          {
            id: 1,
            layoutId: 1,
            active: true,
            title: 'Same Title',
            defaultSetting: true,
            disabled: false,
            icons: [],
            columns: [],
          },
        ];

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockResponse));
        jest
          .spyOn(service, 'applyColumnSettings' as any)
          .mockImplementation((_columnDefs, settings) => settings);

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe(() => {
            const settings = service['tableSettings$'].getValue();
            const defaultSetting = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 1
            );

            expect(defaultSetting.title).toBe('Same Title');
            done();
          });
      });

      it('should not update non-default setting title even if column definition title has changed', (done) => {
        service['_columnDefinitions'] = [
          { layoutId: 1, title: 'New Default Title', columnDefs: [] },
        ];

        const mockResponse: TableSetting<string>[] = [
          {
            id: 1,
            layoutId: 1,
            active: true,
            title: 'Custom User Title',
            defaultSetting: false, // Not a default setting
            disabled: false,
            icons: [],
            columns: [],
          },
        ];

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockResponse));
        jest
          .spyOn(service, 'applyColumnSettings' as any)
          .mockImplementation((_columnDefs, settings) => settings);

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe(() => {
            const settings = service['tableSettings$'].getValue();
            const userSetting = settings.find(
              (tab) => !tab.defaultSetting && tab.id === 1
            );

            // Title should remain unchanged for user settings
            expect(userSetting.title).toBe('Custom User Title');
            done();
          });
      });

      it('should handle case when default setting has no matching column definition', (done) => {
        service['_columnDefinitions'] = [
          { layoutId: 2, title: 'Layout 2', columnDefs: [] }, // No layoutId 1
        ];

        const mockResponse: TableSetting<string>[] = [
          {
            id: 1,
            layoutId: 1, // This layoutId doesn't exist in columnDefinitions
            active: true,
            title: 'Original Title',
            defaultSetting: true,
            disabled: false,
            icons: [],
            columns: [],
          },
        ];

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockResponse));
        jest
          .spyOn(service, 'applyColumnSettings' as any)
          .mockImplementation((_columnDefs, settings) => settings);

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe(() => {
            const settings = service['tableSettings$'].getValue();
            const defaultSetting = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 1
            );

            // Title should remain unchanged if no matching colDef is found
            expect(defaultSetting.title).toBe('Original Title');
            done();
          });
      });

      it('should handle multiple default settings with different layoutIds correctly', (done) => {
        service['_columnDefinitions'] = [
          { layoutId: 1, title: 'Updated Layout 1', columnDefs: [] },
          { layoutId: 2, title: 'Updated Layout 2', columnDefs: [] },
          { layoutId: 3, title: 'Layout 3', columnDefs: [] },
        ];

        const mockResponse: TableSetting<string>[] = [
          {
            id: 1,
            layoutId: 1,
            active: true,
            title: 'Old Layout 1',
            defaultSetting: true,
            disabled: false,
            icons: [],
            columns: [],
          },
          {
            id: 2,
            layoutId: 2,
            active: false,
            title: 'Old Layout 2',
            defaultSetting: true,
            disabled: false,
            icons: [],
            columns: [],
          },
          {
            id: 3,
            layoutId: 3,
            active: false,
            title: 'Layout 3', // Same as colDef title
            defaultSetting: true,
            disabled: false,
            icons: [],
            columns: [],
          },
        ];

        jest.spyOn(service['http'], 'get').mockReturnValue(of(mockResponse));
        jest
          .spyOn(service, 'applyColumnSettings' as any)
          .mockImplementation((_columnDefs, settings) => settings);

        service['loadTableSettings$']()
          .pipe(take(1))
          .subscribe(() => {
            const settings = service['tableSettings$'].getValue();

            // First default setting should be updated
            const setting1 = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 1
            );
            expect(setting1.title).toBe('Updated Layout 1');

            // Second default setting should be updated
            const setting2 = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 2
            );
            expect(setting2.title).toBe('Updated Layout 2');

            // Third default setting should remain the same (title unchanged)
            const setting3 = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 3
            );
            expect(setting3.title).toBe('Layout 3');

            done();
          });
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

    it('should return all layout IDs when settings is null', () => {
      const result = service['getMissingDefaults'](null);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return all layout IDs when settings is an empty array', () => {
      const result = service['getMissingDefaults']([]);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return all layout IDs when no settings have defaultSetting=true', () => {
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
        // Extra non-default setting shouldn't affect result
        { id: 104, layoutId: 4, defaultSetting: false, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([]);
    });

    it('should handle settings with layouts not in column definitions', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: 5, defaultSetting: true, columns: [] }, // Not in column definitions
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2, 3]);
    });

    it('should handle settings with undefined layoutId correctly', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, defaultSetting: true, columns: [] }, // Undefined layoutId
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2, 3]);
    });

    it('should handle settings with null layoutId correctly', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: null as any, defaultSetting: true, columns: [] }, // Null layoutId
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2, 3]);
    });

    it('should handle mixed defaultSetting values correctly', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: 2, defaultSetting: false, columns: [] }, // Not a default setting
        { id: 103, layoutId: 3, defaultSetting: true, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2]);
    });

    it('should handle settings with same layoutId but different defaultSetting values', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: 1, defaultSetting: false, columns: [] }, // Duplicate layoutId but not default
        { id: 103, layoutId: 2, defaultSetting: true, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([3]);
    });
  });

  describe('applyColumnSettings', () => {
    it('should apply user column settings to base column definitions', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      const columnSettings = [
        {
          colId: 'col2',
          visible: true,
          sort: 'asc',
          filter: { type: 'text', value: 'test' },
        },
        { colId: 'col1', visible: false, sort: null, filter: null },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      // Result should maintain the order from columnSettings
      expect(result[0].colId).toBe('col2');
      expect(result[1].colId).toBe('col1');

      // Should preserve properties from both sources
      expect(result[0].headerName).toBe('Column 2');
      expect(result[0].visible).toBe(true);
      expect(result[0].sort).toBe('asc');
      expect(result[0].filterModel).toEqual({ type: 'text', value: 'test' });

      expect(result[1].headerName).toBe('Column 1');
      expect(result[1].visible).toBe(false);
      expect(result[1].sort).toBeNull();
      expect(result[1].filterModel).toBeNull();
    });

    it('should respect the alwaysVisible property regardless of user settings', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1', alwaysVisible: true },
        { colId: 'col2', headerName: 'Column 2', alwaysVisible: false },
      ];

      const columnSettings = [
        { colId: 'col1', visible: false }, // Trying to hide an always visible column
        { colId: 'col2', visible: false },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      // Column1 should remain visible despite user settings
      expect(result[0].colId).toBe('col1');
      expect(result[0].visible).toBe(true);

      // Column2 should respect user settings
      expect(result[1].colId).toBe('col2');
      expect(result[1].visible).toBe(false);
    });

    it('should handle missing columns in user settings', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
        { colId: 'col3', headerName: 'Column 3' },
      ];

      const columnSettings = [
        { colId: 'col1', visible: true },
        // col2 is missing from settings
        // col3 is missing from settings
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      expect(result.length).toBe(3);

      // Columns in user settings should come first
      expect(result[0].colId).toBe('col1');
      expect(result[0].visible).toBe(true);

      // Missing columns should still be included with original properties
      expect(result[1].colId).toBe('col2');
      expect(result[1].headerName).toBe('Column 2');

      expect(result[2].colId).toBe('col3');
      expect(result[2].headerName).toBe('Column 3');
    });

    it('should ignore settings for columns not present in column definitions', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      const columnSettings = [
        { colId: 'col1', visible: true },
        { colId: 'col3', visible: true }, // This column doesn't exist in definitions
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      expect(result.length).toBe(2);
      expect(result.map((col) => col.colId)).toEqual(['col1', 'col2']);
    });

    it('should handle empty column settings by using default order', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      const columnSettings: any[] = [];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings
      );

      expect(result.length).toBe(2);
      expect(result[0].colId).toBe('col1');
      expect(result[1].colId).toBe('col2');
    });

    it('should preserve sort and filter information from column settings', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      const columnSettings = [
        {
          colId: 'col1',
          visible: true,
          sort: 'desc',
          filter: { filterType: 'number', type: 'equals', filter: 42 },
        },
        {
          colId: 'col2',
          visible: true,
          sort: 'asc',
          filter: { filterType: 'text', type: 'contains', filter: 'test' },
        },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      expect(result[0].sort).toBe('desc');
      expect(result[0].filterModel).toEqual({
        filterType: 'number',
        type: 'equals',
        filter: 42,
      });

      expect(result[1].sort).toBe('asc');
      expect(result[1].filterModel).toEqual({
        filterType: 'text',
        type: 'contains',
        filter: 'test',
      });
    });

    it('should remove temporary order property from final result', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      const columnSettings = [
        { colId: 'col2', visible: true },
        { colId: 'col1', visible: true },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      // Verify order property is not present in the result
      expect(result[0]).not.toHaveProperty('order');
      expect(result[1]).not.toHaveProperty('order');
    });

    it('should handle null or undefined column settings as empty array', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      // Test with null
      let result = service['applyColumnSettings'](
        columnDefinitions as any,
        null
      );
      expect(result.length).toBe(2);
      expect(result[0].colId).toBe('col1');
      expect(result[1].colId).toBe('col2');

      // Test with undefined
      result = service['applyColumnSettings'](
        columnDefinitions as any,
        undefined as any
      );
      expect(result.length).toBe(2);
      expect(result[0].colId).toBe('col1');
      expect(result[1].colId).toBe('col2');
    });

    it('should handle column settings with non-existent colIds', () => {
      const columnDefinitions = [{ colId: 'col1', headerName: 'Column 1' }];

      const columnSettings = [
        { colId: 'nonExistentCol', visible: true },
        { colId: 'col1', visible: false },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      // Should only include columns from definitions
      expect(result.length).toBe(1);
      expect(result[0].colId).toBe('col1');
      expect(result[0].visible).toBe(false);
    });

    it('should handle empty column definitions gracefully', () => {
      const columnDefinitions = [] as any;
      const columnSettings = [
        { colId: 'col1', visible: true },
        { colId: 'col2', visible: false },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      // Should return empty array when no column definitions exist
      expect(result).toEqual([]);
    });

    it('should handle column definitions with special characters in colId', () => {
      const columnDefinitions = [
        { colId: 'col-1', headerName: 'Column 1' },
        { colId: 'col.2', headerName: 'Column 2' },
        { colId: 'col_3[0]', headerName: 'Column 3' },
      ];

      const columnSettings = [
        { colId: 'col-1', visible: true },
        { colId: 'col.2', visible: false },
        { colId: 'col_3[0]', visible: true },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      expect(result.length).toBe(3);
      expect(result[0].colId).toBe('col-1');
      expect(result[0].visible).toBe(true);
      expect(result[1].colId).toBe('col.2');
      expect(result[1].visible).toBe(false);
      expect(result[2].colId).toBe('col_3[0]');
      expect(result[2].visible).toBe(true);
    });

    it('should handle column settings with extra properties', () => {
      const columnDefinitions = [{ colId: 'col1', headerName: 'Column 1' }];

      const columnSettings = [
        {
          colId: 'col1',
          visible: true,
          extraProp1: 'extra1',
          extraProp2: 42,
          nestedProp: { key: 'value' },
        },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      // Should not copy extra properties that aren't defined in the method
      expect(result[0].colId).toBe('col1');
      expect(result[0].visible).toBe(true);
      expect(result[0].headerName).toBe('Column 1');
      expect((result[0] as any).extraProp1).toBeUndefined();
      expect((result[0] as any).extraProp2).toBeUndefined();
      expect((result[0] as any).nestedProp).toBeUndefined();
    });

    it('should preserve (pseudo) numerical colIds', () => {
      const columnDefinitions = [
        { colId: '1', headerName: 'Column 1' },
        { colId: '2', headerName: 'Column 2' },
      ];

      const columnSettings = [
        { colId: '2', visible: true },
        { colId: '1', visible: false },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      expect(result[0].colId).toBe('2');
      expect(result[1].colId).toBe('1');
    });

    it('should handle mixed case sensitivity in colIds', () => {
      const columnDefinitions = [
        { colId: 'COL1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      const columnSettings = [
        { colId: 'COL1', visible: true }, // Same case
        { colId: 'col2', visible: false }, // Same case
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      expect(result[0].colId).toBe('COL1');
      expect(result[0].visible).toBe(true);
      expect(result[1].colId).toBe('col2');
      expect(result[1].visible).toBe(false);
    });
  });
});
