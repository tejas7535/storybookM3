import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ColumnState } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks';
import { FilterState, GridState } from '../../models/grid-state.model';
import { QuotationDetail } from '../../models/quotation-detail';
import { AgGridStateService } from './ag-grid-state.service';

const translatedViewName = 'translate it';

class LocalStorageMock {
  public store: { [key: string]: string } = {};

  setStore(store: { [key: string]: string }): void {
    this.store = store;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string {
    // eslint-disable-next-line unicorn/no-null
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

const mockState = {
  version: 1,
  customViews: [
    { id: 0, title: translatedViewName, state: { columnState: [] } },
    { id: 3, title: 'test view 1', state: { columnState: [] } },
    { id: 1, title: 'test view 2', state: { columnState: [] } },
    { id: 2, title: 'test view 3', state: { columnState: [] } },
  ],
} as GridState;

describe('AgGridStateService', () => {
  let spectator: SpectatorService<AgGridStateService>;
  let service: AgGridStateService;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: AgGridStateService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [{ provide: LOCAL_STORAGE, useClass: LocalStorageMock }],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(AgGridStateService);
    localStorage = spectator.inject(
      LOCAL_STORAGE
    ) as unknown as LocalStorageMock;

    localStorage.clear();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    test('should save to local storage if key does not already exist', () => {
      service['localStorage'].getItem = jest.fn().mockReturnValue('');
      service['localStorage'].setItem = jest.fn();

      service.getCustomViews = jest.fn();
      const expectedKey = 'GQ_PROCESS_CASE_STATE';

      service.init('process_case');

      expect(service['localStorage'].setItem).toHaveBeenCalledTimes(1);
      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        expectedKey,
        JSON.stringify({
          version: 1,
          customViews: [
            {
              id: 0,
              title: translatedViewName,
              state: { columnState: [] },
            },
          ],
        })
      );
    });
    test('should NOT save to local storage if key already exists', () => {
      service['localStorage'].getItem = jest.fn().mockReturnValue('{}');
      service['localStorage'].setItem = jest.fn();

      service.init('process_case');

      expect(service['localStorage'].setItem).not.toHaveBeenCalled();
    });
  });

  describe('getColumnStateForCurrentView', () => {
    test('should return columns for current table and view', () => {
      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const fakeStore = JSON.stringify({
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: {
              columnState,
            },
          },
        ],
      });

      localStorage.setItem('GQ_PROCESS_CASE_STATE', fakeStore);

      service.init('process_case');
      const result = service.getColumnStateForCurrentView();

      expect(result).toEqual(columnState);
    });

    test('should return columns for different views after switching', () => {
      const columnState0: ColumnState[] = [
        { colId: 'col0', pinned: 'left', sort: 'asc' },
      ];
      const columnState1: ColumnState[] = [
        { colId: 'col0', pinned: 'right', sort: 'asc' },
      ];
      const columnState2: ColumnState[] = [
        { colId: 'col0', pinned: 'left', sort: 'desc' },
      ];

      const fakeStore = JSON.stringify({
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: {
              columnState: columnState0,
            },
          },
          {
            id: 1,
            title: 'test-view-1',
            state: {
              columnState: columnState1,
            },
          },
          {
            id: 2,
            title: 'test-view-2',
            state: {
              columnState: columnState2,
            },
          },
        ],
      });

      localStorage.setItem('GQ_PROCESS_CASE_STATE', fakeStore);

      service.init('process_case');
      const result0 = service.getColumnStateForCurrentView();

      service.setActiveView(1);
      const result1 = service.getColumnStateForCurrentView();

      service.setActiveView(2);
      const result2 = service.getColumnStateForCurrentView();

      expect(result0).toEqual(columnState0);
      expect(result1).toEqual(columnState1);
      expect(result2).toEqual(columnState2);
    });

    test('should return empty array if key does not exist', () => {
      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const fakeStore = JSON.stringify({
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: {
              columnState,
            },
          },
        ],
      });

      localStorage.setItem('GQ_PROCESS_CASE_STATE', fakeStore);

      service.init('fake_key_does_not_exist');
      const result = service.getColumnStateForCurrentView();

      expect(result).toEqual([]);
    });
  });

  describe('setColumnStateForCurrentView', () => {
    test('should set the given column state in localstorage', () => {
      service.localStorage.setStore({});

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];

      service.init('process_case');
      service.setColumnStateForCurrentView(columnState);

      expect(localStorage.store['GQ_PROCESS_CASE_STATE']).toEqual(
        JSON.stringify({
          version: 1,
          customViews: [
            { id: 0, title: translatedViewName, state: { columnState } },
          ],
        })
      );
    });

    test('should set the given column state in localstorage and not overwrite other views', () => {
      const columnState0: ColumnState[] = [
        { colId: 'col0', pinned: 'left', sort: 'asc' },
      ];
      const columnState1: ColumnState[] = [
        { colId: 'col0', pinned: 'right', sort: 'asc' },
      ];
      const columnState2: ColumnState[] = [
        { colId: 'col0', pinned: 'left', sort: 'desc' },
      ];

      const fakeStore = {
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: {
              columnState: columnState0,
            },
          },
          {
            id: 1,
            title: 'test-view-1',
            state: {
              columnState: columnState1,
            },
          },
          {
            id: 2,
            title: 'test-view-2',
            state: {
              columnState: columnState2,
            },
          },
        ],
      };

      localStorage.setItem('GQ_PROCESS_CASE_STATE', JSON.stringify(fakeStore));

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];

      service.init('process_case');
      service.setActiveView(1);
      service.setColumnStateForCurrentView(columnState);

      expect(localStorage.store['GQ_PROCESS_CASE_STATE']).toEqual(
        JSON.stringify({
          ...fakeStore,
          customViews: [
            fakeStore.customViews[0],
            { ...fakeStore.customViews[1], state: { columnState } },
            fakeStore.customViews[2],
          ],
        })
      );
    });
  });

  describe('getColumnData', () => {
    test('should return null if theres no entry in localstorage', () => {
      expect(service.getColumnData('1234')).toBeNull();
    });

    test('should return data', () => {
      const columnData = [
        {
          gqPositionId: '53c0bea0-532c-4b27-8cf6-0293d8543bcf',
          quotationItemId: '220',
        },
      ];
      const fakeStore = { '1234_items': JSON.stringify(columnData) };

      localStorage.setStore(fakeStore);

      const result = service.getColumnData('1234');

      expect(result).toEqual(columnData);
    });
  });

  describe('setColumnData', () => {
    test('should save the gqPositionId and actionItemId of quotation details to the local storage', () => {
      service.localStorage.setStore({});

      const quotationDetails: QuotationDetail[] = [
        {
          ...QUOTATION_DETAIL_MOCK,
          gqPositionId: '53c0bea0-532c-4b27-8cf6-0293d8543bcf',
          quotationItemId: 220,
        },
      ];
      const expected =
        '[{"gqPositionId":"53c0bea0-532c-4b27-8cf6-0293d8543bcf","quotationItemId":220}]';

      service.setColumnData('1234', quotationDetails);

      expect(localStorage.store['1234_items']).toEqual(expected);
    });

    test('should replace entry in localstorage if key is already present', () => {
      const fakeStore = {
        key: JSON.stringify({
          columnData:
            '[{"gqPositionId":"53c0bea0-532c-4b27-8cf6-0293d8543bcf","quotationItemId":220}]',
        }),
      };

      service.localStorage.setStore(fakeStore);

      const quotationDetails: QuotationDetail[] = [
        {
          ...QUOTATION_DETAIL_MOCK,
          gqPositionId: '5ac062e6-8c0b-4457-8548-3e126bd9a96f',
          quotationItemId: 330,
        },
      ];
      const expected =
        '[{"gqPositionId":"5ac062e6-8c0b-4457-8548-3e126bd9a96f","quotationItemId":330}]';

      service.setColumnData('1234', quotationDetails);

      expect(localStorage.store['1234_items']).toEqual(expected);
    });
  });
  describe('setColumnFilters', () => {
    test('should set columnFilters', () => {
      service.localStorage.setStore({});

      const filterModels = [{ filterType: 'set', values: ['20'] }];
      const filterState: FilterState[] = [
        {
          actionItemId: '46425',
          filterModels,
        },
      ];

      service.init('process_case');
      service.setColumnFilterForCurrentView('46425', filterModels);

      expect(localStorage.store['GQ_PROCESS_CASE_STATE']).toEqual(
        JSON.stringify({
          version: 1,
          customViews: [
            {
              id: 0,
              title: translatedViewName,
              state: { columnState: [], filterState },
            },
          ],
        })
      );
    });
  });
  describe('getColumnFilters', () => {
    test('should return columns for current table and view', () => {
      const filterState: FilterState[] = [
        {
          actionItemId: '46425',
          filterModels: { colId: 'width', pinned: 'left' },
        },
      ];
      const fakeStore = JSON.stringify({
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: {
              columnState: [],
              filterState,
            },
          },
        ],
      });

      localStorage.setItem('GQ_PROCESS_CASE_STATE', fakeStore);

      service.init('process_case');
      const result = service.getColumnFiltersForCurrentView();

      expect(result).toEqual(filterState);
    });

    test('should return columns for different views after switching', () => {
      const filterState0: FilterState[] = [
        {
          actionItemId: '46425',
          filterModels: { colId: 'width', pinned: 'left' },
        },
      ];
      const filterState1: FilterState[] = [
        {
          actionItemId: '46425',
          filterModels: { colId: 'width', pinned: 'right' },
        },
      ];
      const filterState2: FilterState[] = [
        {
          actionItemId: '46425',
          filterModels: { colId: 'height', pinned: 'left' },
        },
      ];

      const fakeStore = JSON.stringify({
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: {
              columnState: [],
              filterState: filterState0,
            },
          },
          {
            id: 1,
            title: 'test-view-1',
            state: {
              columnState: [],
              filterState: filterState1,
            },
          },
          {
            id: 2,
            title: 'test-view-2',
            state: {
              columnState: [],
              filterState: filterState2,
            },
          },
        ],
      });

      localStorage.setItem('GQ_PROCESS_CASE_STATE', fakeStore);

      service.init('process_case');
      const result0 = service.getColumnFiltersForCurrentView();

      service.setActiveView(1);
      const result1 = service.getColumnFiltersForCurrentView();

      service.setActiveView(2);
      const result2 = service.getColumnFiltersForCurrentView();

      expect(result0).toEqual(filterState0);
      expect(result1).toEqual(filterState1);
      expect(result2).toEqual(filterState2);
    });

    test('should return empty array if key does not exist', () => {
      const filterState: FilterState[] = [
        {
          actionItemId: '46425',
          filterModels: { colId: 'width', pinned: 'left' },
        },
      ];
      const fakeStore = JSON.stringify({
        version: 1,
        customViews: [
          {
            id: 0,
            title: translatedViewName,
            state: {
              columnState: [],
              filterState,
            },
          },
        ],
      });

      localStorage.setItem('GQ_PROCESS_CASE_STATE', fakeStore);

      service.init('fake_key_does_not_exist');
      const result = service.getColumnStateForCurrentView();

      expect(result).toEqual([]);
    });
  });

  describe('getCurrentViewId', () => {
    test('should return activeViewId', () => {
      service.getColumnStateForCurrentView = jest.fn();
      service.getColumnFiltersForCurrentView = jest.fn();
      const id = Math.round(Math.random() * 100);
      service.setActiveView(id);

      expect(service.getCurrentViewId()).toEqual(id);
    });
  });

  describe('createNewView', () => {
    test('should create new view from scratch', () => {
      service['localStorage'].setItem = jest.fn();
      service['localStorage'].getItem = jest
        .fn()
        .mockReturnValue(JSON.stringify(mockState));

      service.init('process_case');
      service.createViewFromScratch('test-view');

      expect(service['localStorage'].setItem).toHaveBeenCalledTimes(1);
      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        'GQ_PROCESS_CASE_STATE',
        JSON.stringify({
          ...mockState,
          customViews: [
            ...mockState.customViews,
            {
              id: 4,
              title: 'test-view',
              state: {
                columnState: [],
                filterState: [],
              },
            },
          ],
        })
      );
    });

    test('should create more then 10 views', () => {
      const bigMockState = {
        ...mockState,
        customViews: [
          { id: 0, title: translatedViewName, state: { columnState: [] } },
          { id: 3, title: 'test view 1', state: { columnState: [] } },
          { id: 1, title: 'test view 2', state: { columnState: [] } },
          { id: 2, title: 'test view 3', state: { columnState: [] } },
          { id: 4, title: 'test view 4', state: { columnState: [] } },
          { id: 5, title: 'test view 5', state: { columnState: [] } },
          { id: 6, title: 'test view 6', state: { columnState: [] } },
          { id: 7, title: 'test view 7', state: { columnState: [] } },
          { id: 8, title: 'test view 8', state: { columnState: [] } },
          { id: 9, title: 'test view 9', state: { columnState: [] } },
          { id: 10, title: 'test view 10', state: { columnState: [] } },
        ],
      } as any;

      service['localStorage'].setItem = jest.fn();
      service['localStorage'].getItem = jest
        .fn()
        .mockReturnValue(JSON.stringify(bigMockState));

      service.init('process_case');
      service.createViewFromScratch('test-view');

      expect(service['localStorage'].setItem).toHaveBeenCalledTimes(1);
      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        'GQ_PROCESS_CASE_STATE',
        JSON.stringify({
          ...bigMockState,
          customViews: [
            ...bigMockState.customViews,
            {
              id: 11,
              title: 'test-view',
              state: {
                columnState: [],
                filterState: [],
              },
            },
          ],
        })
      );
    });

    test('should create new view from current view', () => {
      const mockColumnState = [
        {
          colId: 'test',
          sort: 'desc',
        },
        {
          colId: 'test2',
          sort: 'asc',
        },
      ];

      const mockFilterState = [
        {
          actionItemId: '46426',
          filterModel: { colId: 'width', pinned: 'right' },
        },
      ];

      service['getColumnFilters'] = jest.fn().mockReturnValue(mockFilterState);
      service['getCurrentView'] = jest.fn().mockReturnValue({
        state: { columnState: mockColumnState, filterState: mockFilterState },
      });
      service['localStorage'].setItem = jest.fn();
      service['localStorage'].getItem = jest
        .fn()
        .mockReturnValue(JSON.stringify(mockState));

      service.init('process_case');
      service.createViewFromCurrentView('test-view', '46426');

      expect(service['localStorage'].setItem).toHaveBeenCalledTimes(1);
      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        'GQ_PROCESS_CASE_STATE',
        JSON.stringify({
          ...mockState,
          customViews: [
            ...mockState.customViews,
            {
              id: 4,
              title: 'test-view',
              state: {
                columnState: mockColumnState,
                filterState: mockFilterState,
              },
            },
          ],
        })
      );
    });
  });

  describe('deleteView', () => {
    test('should delete view', () => {
      service['localStorage'].setItem = jest.fn();
      service['localStorage'].getItem = jest
        .fn()
        .mockReturnValue(JSON.stringify(mockState));

      service.init('process_case');
      service.deleteView(1);

      expect(service['localStorage'].setItem).toHaveBeenCalledTimes(1);
      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        'GQ_PROCESS_CASE_STATE',
        JSON.stringify({
          ...mockState,
          customViews: [
            { id: 0, title: translatedViewName, state: { columnState: [] } },
            { id: 3, title: 'test view 1', state: { columnState: [] } },
            { id: 2, title: 'test view 3', state: { columnState: [] } },
          ],
        })
      );
    });
  });

  describe('udpateViewName', () => {
    test('should update view name', () => {
      service['localStorage'].setItem = jest.fn();
      service['localStorage'].getItem = jest
        .fn()
        .mockReturnValue(JSON.stringify(mockState));

      service.init('process_case');
      service.updateViewName(1, 'new-name');

      expect(service['localStorage'].setItem).toHaveBeenCalledTimes(1);
      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        'GQ_PROCESS_CASE_STATE',
        JSON.stringify({
          ...mockState,
          customViews: [
            { id: 0, title: translatedViewName, state: { columnState: [] } },
            { id: 3, title: 'test view 1', state: { columnState: [] } },
            { id: 1, title: 'new-name', state: { columnState: [] } },
            { id: 2, title: 'test view 3', state: { columnState: [] } },
          ],
        })
      );
    });
  });

  describe('resetFilterModelsOfDefaultView', () => {
    test('should reset the filterModel of defaultView', () => {
      service['setColumnFilters'] = jest.fn();

      service.resetFilterModelsOfDefaultView('46426');
      expect(service['setColumnFilters']).toHaveBeenCalledTimes(1);
    });
  });

  describe('renameQuotationIdToActionItem', () => {
    const mockGridState = {
      version: 1,
      customViews: [
        {
          id: 0,
          title: 'Default',
          state: {
            columnState: [],
            filterState: [
              {
                quotationId: '46426',
                filterModels: { colId: 'width', pinned: 'right' },
              } as any,
            ],
          },
        },
      ],
    } as GridState;
    const renamedGridState = {
      version: 1,
      customViews: [
        {
          id: 0,
          title: 'Default',
          state: {
            columnState: [],
            filterState: [
              {
                actionItemId: '46426',
                filterModels: { colId: 'width', pinned: 'right' },
              } as any,
            ],
          },
        },
      ],
    } as GridState;
    test('should return if gridState is null', () => {
      localStorage.setItem = jest.fn();
      service['getGridState'] = jest
        .fn()
        .mockReturnValue(undefined as GridState);

      service.renameQuotationIdToActionItemForProcessCaseState();
      expect(service['getGridState']).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('should rename quotationItemId to actionItemId', () => {
      service['getGridState'] = jest.fn().mockReturnValue(mockGridState);
      localStorage.setItem = jest.fn();

      service.renameQuotationIdToActionItemForProcessCaseState();

      expect(service['getGridState']).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'GQ_PROCESS_CASE_STATE',
        JSON.stringify(renamedGridState)
      );
    });

    test('should not rename when already done', () => {
      service['getGridState'] = jest.fn().mockReturnValue(renamedGridState);
      localStorage.setItem = jest.fn();

      service.renameQuotationIdToActionItemForProcessCaseState();

      expect(service['getGridState']).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).not.toHaveBeenCalledTimes(1);
    });
  });
});
