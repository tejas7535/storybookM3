import { fakeAsync, tick } from '@angular/core/testing';

import { of, take, throwError } from 'rxjs';

import { ColumnState } from 'ag-grid-enterprise';

import { Stub } from '../../../test/stub.class';
import * as Helper from '../../../utils/validation/data-validation';
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
      expect(httpPostSpy).not.toHaveBeenCalled();
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

      service['dataToSave$'].next({
        settings: mockTableSettings as any,
        skip: false,
      });

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

      service['dataToSave$'].next({
        settings: mockTableSettings as any,
        skip: false,
      });

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

      service.init({
        tableId: 'testTableId',
        columnDefinitions: [
          { layoutId: 1, title: 'Test Layout', columnDefs: [] },
        ],
        gridApi: Stub.getGridApi(),
        maxAllowedTabs: 5,
      });

      service['dataToSave$'].next({
        settings: mockTableSettings,
        skip: false,
      });

      setTimeout(() => {
        expect(httpPostSpy).toHaveBeenCalledWith(
          `${service['URL']}${service['_tableId']}`,
          [{ id: 1, layoutId: 1, active: true, title: 'Test', columns: [] }]
        );
        done();
      }, 200);
    });

    it('should not make HTTP post request when dataToSave$ emits with skip=true', fakeAsync(() => {
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

      httpPostSpy.mockClear();

      service['dataToSave$'].next({
        settings: mockTableSettings as any,
        skip: true,
      });

      tick(100);

      expect(httpPostSpy).not.toHaveBeenCalled();
    }));

    it('should debounce multiple dataToSave$ emissions within the debounce period', fakeAsync(() => {
      const mockTableId = 'testTableId';
      const mockColumnDefinitions: NamedColumnDefs[] = [
        { layoutId: 1, title: 'Test Layout', columnDefs: [] },
      ];
      const mockGridApi = Stub.getGridApi();

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

      httpPostSpy.mockClear();

      service['dataToSave$'].next({
        settings: [{ id: 1, title: 'First', columns: [] }] as any,
        skip: false,
      });

      tick(50);

      service['dataToSave$'].next({
        settings: [{ id: 2, title: 'Second', columns: [] }] as any,
        skip: false,
      });

      tick(50);

      service['dataToSave$'].next({
        settings: [{ id: 3, title: 'Third', columns: [] }] as any,
        skip: false,
      });

      tick(100);

      expect(httpPostSpy).toHaveBeenCalledTimes(1);
      expect(httpPostSpy).toHaveBeenCalledWith(
        `${service['URL']}${mockTableId}`,
        [{ id: 3, title: 'Third', columns: [] }]
      );
    }));

    it('should correctly handle null or undefined data in switchMap', fakeAsync(() => {
      const mockTableId = 'testTableId';
      const mockColumnDefinitions: NamedColumnDefs[] = [
        { layoutId: 1, title: 'Test Layout', columnDefs: [] },
      ];
      const mockGridApi = Stub.getGridApi();

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

      httpPostSpy.mockClear();

      service['dataToSave$'].next(null as any);
      tick(100);
      expect(httpPostSpy).toHaveBeenCalled();

      service['dataToSave$'].next(undefined as any);
      tick(100);
      expect(httpPostSpy).toHaveBeenCalled();

      service['dataToSave$'].next({
        settings: null as any,
        skip: false,
      });
      tick(100);
      expect(httpPostSpy).toHaveBeenCalledWith(
        `${service['URL']}${mockTableId}`,
        []
      );

      httpPostSpy.mockClear();
      service['dataToSave$'].next({
        settings: undefined as any,
        skip: false,
      });
      tick(100);
      expect(httpPostSpy).toHaveBeenCalledWith(
        `${service['URL']}${mockTableId}`,
        []
      );
    }));

    it('should continue subscription after HTTP error', fakeAsync(() => {
      const mockTableId = 'testTableId';
      const mockColumnDefinitions: NamedColumnDefs[] = [
        { layoutId: 1, title: 'Test Layout', columnDefs: [] },
      ];
      const mockGridApi = Stub.getGridApi();

      jest
        .spyOn<any, any>(service, 'loadTableSettings$')
        .mockReturnValue(of([]));

      const httpPostSpy = jest
        .spyOn(service['http'], 'post')
        .mockImplementationOnce(() =>
          throwError(() => new Error('Backend error'))
        )
        .mockImplementationOnce(() => of(null));

      service.init({
        tableId: mockTableId,
        columnDefinitions: mockColumnDefinitions,
        gridApi: mockGridApi,
        maxAllowedTabs: 5,
      });

      service['dataToSave$'].next({
        settings: [{ id: 1, title: 'First', columns: [] }] as any,
        skip: false,
      });

      tick(100);

      service['dataToSave$'].next({
        settings: [{ id: 2, title: 'Second', columns: [] }] as any,
        skip: false,
      });

      tick(100);

      expect(httpPostSpy).toHaveBeenCalledTimes(2);
      expect(httpPostSpy.mock.calls[1][1]).toEqual([
        { id: 2, title: 'Second', columns: [] },
      ]);
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

      service['dataToSave$'].next({
        settings: [
          {
            id: 1,
            layoutId: 1,
            active: false,
            title: 'Test Layout',
            defaultSetting: true,
            disabled: false,
            icons: [],
            columns: [],
          },
        ],
        skip: false,
      });
      const dataToSaveSpy = jest.spyOn(service['dataToSave$'], 'next');
      const tableSettingsSpy = jest.spyOn(service['tableSettings$'], 'next');

      service['tableSettings$'].next(mockTableSettings);

      service
        .setTableSettings$(1)
        .pipe(take(1))
        .subscribe(() => {
          expect(dataToSaveSpy).toHaveBeenCalledWith({
            settings: [
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
                    filterModel: null,
                    filter: {
                      filter: 'filter1',
                      filterType: 'text',
                    },
                  },
                  {
                    colId: 'col2',
                    visible: false,
                    sort: null,
                    filter: null,
                    filterModel: null,
                  },
                ],
              },
            ],
            skip: false,
          });

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
                  filterModel: null,
                },
                {
                  colId: 'col2',
                  visible: false,
                  sort: null,
                  filter: null,
                  filterModel: null,
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

      service['dataToSave$'].next({
        settings: [],
        skip: false,
      });

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
          expect(dataToSaveSpy).toHaveBeenCalledWith({
            settings: [
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
                    filter: null,
                    filterModel: null,
                  },
                ],
              },
            ],
            skip: false,
          });

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
                  filter: null,
                  filterModel: null,
                },
              ],
            },
          ]);

          done();
        });
    });

    it('should use the first table setting if no default setting exists', (done) => {
      const mockColumnState: ColumnState[] = [
        { colId: 'col1', hide: false, sort: 'asc' },
      ];

      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 1,
          active: true,
          title: 'First Layout',
          defaultSetting: false,
          disabled: false,
          icons: [],
          columns: [],
        },
        {
          id: 2,
          layoutId: 2,
          active: false,
          title: 'Second Layout',
          defaultSetting: false,
          disabled: false,
          icons: [],
          columns: [],
        },
      ];

      service['dataToSave$'].next({
        settings: [],
        skip: false,
      });

      jest
        .spyOn(service['gridApi'], 'getColumnState')
        .mockReturnValue(mockColumnState);
      jest.spyOn(service['gridApi'], 'getFilterModel').mockReturnValue({});

      service['tableSettings$'].next(mockTableSettings);

      const dataToSaveSpy = jest.spyOn(service['dataToSave$'], 'next');

      service
        .setTableSettings$(999)
        .pipe(take(1))
        .subscribe(() => {
          const savedSettings = dataToSaveSpy.mock.calls[0][0].settings;
          expect(savedSettings[0].id).toBe(1);
          expect(savedSettings[0].columns).toHaveLength(1);
          expect(savedSettings[0].columns[0].colId).toBe('col1');
          done();
        });
    });

    it('should not emit new data when no changes are detected', (done) => {
      const mockColumnState: ColumnState[] = [
        { colId: 'col1', hide: false, sort: 'asc' },
      ];

      const mockTableSettings: TableSetting<string>[] = [
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
              filter: null,
              filterModel: null,
            },
          ],
        },
      ];
      service['dataToSave$'].next({
        settings: [],
        skip: false,
      });

      jest.spyOn(Helper, 'isEqual').mockReturnValue(true);

      service['tableSettings$'].next(mockTableSettings);

      jest
        .spyOn(service['gridApi'], 'getColumnState')
        .mockReturnValue(mockColumnState);
      jest.spyOn(service['gridApi'], 'getFilterModel').mockReturnValue({});

      const dataToSaveSpy = jest.spyOn(service['dataToSave$'], 'next');
      const tableSettingsSpy = jest.spyOn(service['tableSettings$'], 'next');

      dataToSaveSpy.mockClear();
      tableSettingsSpy.mockClear();

      service
        .setTableSettings$(1)
        .pipe(take(1))
        .subscribe(() => {
          expect(dataToSaveSpy).not.toHaveBeenCalled();
          expect(tableSettingsSpy).not.toHaveBeenCalled();

          done();
        });
    });

    it('should handle empty filter model', (done) => {
      const mockColumnState: ColumnState[] = [
        { colId: 'col1', hide: false, sort: 'asc' },
      ];

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
      service['dataToSave$'].next({
        settings: [
          {
            id: 1,
            layoutId: 1,
            active: false,
            title: 'Test Layout',
            defaultSetting: true,
            disabled: false,
            icons: [],
            columns: [],
          },
        ],
        skip: false,
      });
      jest
        .spyOn(service['gridApi'], 'getColumnState')
        .mockReturnValue(mockColumnState);
      jest.spyOn(service['gridApi'], 'getFilterModel').mockReturnValue(null);

      service['tableSettings$'].next(mockTableSettings);

      let capturedSettings: any;
      jest.spyOn(service['dataToSave$'], 'next').mockImplementation((value) => {
        capturedSettings = value;

        return;
      });

      service
        .setTableSettings$(1)
        .pipe(take(1))
        .subscribe(() => {
          expect(
            capturedSettings?.settings?.[0]?.columns?.[0]?.filter
          ).toBeNull();
          done();
        });
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
          expect(response.length).toBe(3);

          const defaultSettings = response.filter(
            (setting) => setting.id !== TableService.addId
          );
          expect(defaultSettings.length).toBe(2);

          expect(defaultSettings[0].layoutId).toBe(1);
          expect(defaultSettings[0].title).toBe('Layout 1');
          expect(defaultSettings[0].defaultSetting).toBe(true);
          expect(defaultSettings[0].active).toBe(false);
          expect(defaultSettings[0].disabled).toBe(false);
          expect(defaultSettings[0].icons.length).toBe(1);
          expect(defaultSettings[0].icons[0].name).toBe('lock');
          expect(defaultSettings[0].icons[0].disabled).toBe(true);

          expect(defaultSettings[1].layoutId).toBe(2);
          expect(defaultSettings[1].title).toBe('Layout 2');
          expect(defaultSettings[1].defaultSetting).toBe(true);

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

            const filteredSetting = settings.find(
              (tab) => tab.id !== TableService.addId
            );

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

            const filteredSettings = settings.filter(
              (tab) => tab.id !== TableService.addId
            );

            expect(filteredSettings[0].defaultSetting).toBe(true);
            expect(filteredSettings[0].id).toBe(2);

            expect(filteredSettings[1].defaultSetting).toBe(true);
            expect(filteredSettings[1].id).toBe(4);

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
        service['_columnDefinitions'] = [
          { layoutId: 1, title: 'New Layout Title', columnDefs: [] },
        ];

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

            const defaultSetting = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 1
            );

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
            defaultSetting: false,
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

            expect(userSetting.title).toBe('Custom User Title');
            done();
          });
      });

      it('should handle case when default setting has no matching column definition', (done) => {
        service['_columnDefinitions'] = [
          { layoutId: 2, title: 'Layout 2', columnDefs: [] },
        ];

        const mockResponse: TableSetting<string>[] = [
          {
            id: 1,
            layoutId: 1,
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
            title: 'Layout 3',
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

            const setting1 = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 1
            );
            expect(setting1.title).toBe('Updated Layout 1');

            const setting2 = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 2
            );
            expect(setting2.title).toBe('Updated Layout 2');

            const setting3 = settings.find(
              (tab) => tab.defaultSetting && tab.layoutId === 3
            );
            expect(setting3.title).toBe('Layout 3');

            done();
          });
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

    it('should handle empty columns array', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [{ name: IconType.Edit }],
          columns: [],
        },
      ];

      const result = service['mapToTableSettings'](mockTableSettings);

      expect(result[0].columns).toEqual([]);
    });

    it('should handle null or undefined table settings', () => {
      expect(service['mapToTableSettings'](null as any)).toEqual([]);
      expect(service['mapToTableSettings'](undefined as any)).toEqual([]);
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

        { id: 104, layoutId: 4, defaultSetting: false, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([]);
    });

    it('should handle settings with layouts not in column definitions', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: 5, defaultSetting: true, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2, 3]);
    });

    it('should handle settings with undefined layoutId correctly', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, defaultSetting: true, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2, 3]);
    });

    it('should handle settings with null layoutId correctly', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: null as any, defaultSetting: true, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2, 3]);
    });

    it('should handle mixed defaultSetting values correctly', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: 2, defaultSetting: false, columns: [] },
        { id: 103, layoutId: 3, defaultSetting: true, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([2]);
    });

    it('should handle settings with same layoutId but different defaultSetting values', () => {
      const settings: TableSetting<string>[] = [
        { id: 101, layoutId: 1, defaultSetting: true, columns: [] },
        { id: 102, layoutId: 1, defaultSetting: false, columns: [] },
        { id: 103, layoutId: 2, defaultSetting: true, columns: [] },
      ] as any;

      const result = service['getMissingDefaults'](settings);
      expect(result).toEqual([3]);
    });
  });

  describe('getClonedAndCleanVersion', () => {
    it('should handle null or undefined table settings', () => {
      const nullResult = service['getClonedAndCleanVersion'](null as any);
      const undefinedResult = service['getClonedAndCleanVersion'](
        undefined as any
      );

      expect(nullResult).toEqual([]);
      expect(undefinedResult).toEqual([]);
    });

    it('should handle non-array input', () => {
      const result = service['getClonedAndCleanVersion']({} as any);
      expect(result).toEqual([]);
    });

    it('should handle null or undefined column properties', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: null,
              filter: null,
              filterModel: null,
            },
          ],
        },
      ];

      const result = service['getClonedAndCleanVersion'](mockTableSettings);

      expect(result[0].columns[0].filter).toBeNull();
      expect(result[0].columns[0].filterModel).toBeNull();
    });

    it('should handle undefined columns', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: undefined as any,
        },
      ];

      const result = service['getClonedAndCleanVersion'](mockTableSettings);

      expect(result[0].columns).toEqual([]);
    });

    it('should handle empty columns array', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: [],
        },
      ];

      const result = service['getClonedAndCleanVersion'](mockTableSettings);

      expect(result[0].columns).toEqual([]);
    });

    it('should handle string filter that does not start with "ag"', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: null,
              filter: 'some-filter',
              filterModel: 'some-model',
            },
          ],
        },
      ];

      const result = service['getClonedAndCleanVersion'](mockTableSettings);

      expect(result[0].columns[0].filter).toBe('some-filter');
      expect(result[0].columns[0].filterModel).toBe('some-model');
    });

    it('should convert "ag" prefixed filter strings to null', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: null,
              filter: 'ag-filter-value',
              filterModel: 'ag-model-value',
            },
          ],
        },
      ];

      const result = service['getClonedAndCleanVersion'](mockTableSettings);

      expect(result[0].columns[0].filter).toBeNull();
      expect(result[0].columns[0].filterModel).toBeNull();
    });

    it('should handle filter as an object', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: null,
              filter: { type: 'equals', value: 42 },
              filterModel: { type: 'contains', value: 'test' },
            },
          ],
        },
      ];

      const result = service['getClonedAndCleanVersion'](mockTableSettings);

      expect(result[0].columns[0].filter).toEqual({
        type: 'equals',
        value: 42,
      });
      expect(result[0].columns[0].filterModel).toEqual({
        type: 'contains',
        value: 'test',
      });
    });

    it('should handle filter with no startsWith method (non-string)', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: null,
              filter: 123 as any,
              filterModel: true as any,
            },
          ],
        },
      ];

      const result = service['getClonedAndCleanVersion'](mockTableSettings);

      expect(result[0].columns[0].filter).toBe(123);
      expect(result[0].columns[0].filterModel).toBe(true);
    });

    it('should handle a complex nested structure of table settings', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [
            { name: IconType.Edit, disabled: true },
            { name: IconType.Delete, disabled: false },
          ],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: 'asc',
              filter: 'ag-test',
              filterModel: null,
            },
          ],
        },
        {
          id: 2,
          layoutId: 3,
          active: false,
          title: 'Another Tab',
          disabled: true,
          defaultSetting: false,
          icons: [{ name: IconType.Lock }],
          columns: [
            {
              colId: 'col2',
              visible: false,
              sort: 'desc',
              filter: null,
              filterModel: 'ag-test',
            },
          ],
        },
      ];

      const result = service['getClonedAndCleanVersion'](mockTableSettings);

      expect(result).toHaveLength(2);
      expect(result[0].icons).toHaveLength(2);
      expect(result[0].icons[0]).not.toBe(mockTableSettings[0].icons[0]);
      expect(result[0].columns[0].filter).toBeNull();
      expect(result[1].columns[0].filterModel).toBeNull();

      expect(result[0]).not.toBe(mockTableSettings[0]);
      expect(result[1]).not.toBe(mockTableSettings[1]);
      expect(result[0].columns).not.toBe(mockTableSettings[0].columns);
      expect(result[1].columns).not.toBe(mockTableSettings[1].columns);
    });

    it('should handle columns with startsWith method that returns false', () => {
      const mockTableSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: null,
              filter: 'not-ag-filter',
              filterModel: 'not-ag-model',
            },
          ],
        },
      ];

      const result = service['getClonedAndCleanVersion'](mockTableSettings);

      expect(result[0].columns[0].filter).toBe('not-ag-filter');
      expect(result[0].columns[0].filterModel).toBe('not-ag-model');
    });

    it('should provide deep cloning so that source objects are not modified', () => {
      const sourceSettings: TableSetting<string>[] = [
        {
          id: 1,
          layoutId: 2,
          active: true,
          title: 'Test Title',
          disabled: false,
          defaultSetting: true,
          icons: [{ name: IconType.Edit }],
          columns: [
            {
              colId: 'col1',
              visible: true,
              sort: 'asc',
              filter: 'normal-filter',
              filterModel: null,
            },
          ],
        },
      ];

      const result = service['getClonedAndCleanVersion'](sourceSettings);

      result[0].title = 'Modified Title';
      result[0].icons[0].name = IconType.Delete;
      result[0].columns[0].visible = false;
      result[0].columns[0].filter = 'modified-filter';

      expect(sourceSettings[0].title).toBe('Test Title');
      expect(sourceSettings[0].icons[0].name).toBe(IconType.Edit);
      expect(sourceSettings[0].columns[0].visible).toBe(true);
      expect(sourceSettings[0].columns[0].filter).toBe('normal-filter');
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

      expect(result[0].colId).toBe('col2');
      expect(result[1].colId).toBe('col1');

      expect(result[0].headerName).toBe('Column 2');
      expect(result[0].visible).toBe(true);
      expect(result[0].sort).toBe('asc');
      expect(result[0].filterModel).toEqual({ type: 'text', value: 'test' });

      expect(result[1].headerName).toBe('Column 1');
      expect(result[1].visible).toBe(false);
      expect(result[1].sort).toBeNull();
      expect(result[1].filterModel).toBeNull();
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
        { colId: 'COL1', visible: true },
        { colId: 'col2', visible: false },
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

    it('should handle null or undefined column definition properties', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: null, field: undefined } as any,
        { colId: 'col2', headerName: 'Column 2' },
      ];

      const columnSettings = [
        { colId: 'col1', visible: true },
        { colId: 'col2', visible: false },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      expect(result[0].colId).toBe('col1');
      expect(result[0].headerName).toBeNull();
      expect(result[0].field).toBeUndefined();
      expect(result[0].visible).toBe(true);

      expect(result[1].colId).toBe('col2');
      expect(result[1].headerName).toBe('Column 2');
      expect(result[1].visible).toBe(false);
    });

    it('should handle null or undefined column settings as empty array', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      let result = service['applyColumnSettings'](
        columnDefinitions as any,
        null
      );
      expect(result.length).toBe(2);
      expect(result[0].colId).toBe('col1');
      expect(result[1].colId).toBe('col2');

      result = service['applyColumnSettings'](
        columnDefinitions as any,
        undefined as any
      );
      expect(result.length).toBe(2);
      expect(result[0].colId).toBe('col1');
      expect(result[1].colId).toBe('col2');
    });

    it('should handle missing columns in user settings', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
        { colId: 'col3', headerName: 'Column 3' },
      ];

      const columnSettings = [{ colId: 'col1', visible: true }];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      expect(result.length).toBe(3);

      expect(result[0].colId).toBe('col1');
      expect(result[0].visible).toBe(true);

      expect(result[1].colId).toBe('col2');
      expect(result[1].headerName).toBe('Column 2');

      expect(result[2].colId).toBe('col3');
      expect(result[2].headerName).toBe('Column 3');
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

      expect(result[0]).not.toHaveProperty('order');
      expect(result[1]).not.toHaveProperty('order');
    });

    it('should ignore settings for columns not present in column definitions', () => {
      const columnDefinitions = [
        { colId: 'col1', headerName: 'Column 1' },
        { colId: 'col2', headerName: 'Column 2' },
      ];

      const columnSettings = [
        { colId: 'col1', visible: true },
        { colId: 'col3', visible: true },
      ];

      const result = service['applyColumnSettings'](
        columnDefinitions as any,
        columnSettings as any
      );

      expect(result.length).toBe(2);
      expect(result.map((col) => col.colId)).toEqual(['col1', 'col2']);
    });
  });
});
