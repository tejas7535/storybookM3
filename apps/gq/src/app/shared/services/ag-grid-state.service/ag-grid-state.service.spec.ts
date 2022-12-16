import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ColumnState } from 'ag-grid-community';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks';
import { QuotationDetail } from '../../models/quotation-detail';
import { AgGridStateService } from './ag-grid-state.service';

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

describe('AgGridStateService', () => {
  let spectator: SpectatorService<AgGridStateService>;
  let service: AgGridStateService;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: AgGridStateService,
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
      const expectedKey = 'GQ_PROCESS_CASE_STATE';

      service.init('process_case');

      expect(service['localStorage'].setItem).toHaveBeenCalledTimes(1);
      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        expectedKey,
        JSON.stringify({
          version: 1,
          customViews: [
            { id: 0, title: 'default', state: { columnState: [] } },
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
            title: 'default',
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
            title: 'default',
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
            title: 'default',
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
          customViews: [{ id: 0, title: 'default', state: { columnState } }],
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
            title: 'default',
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
    test('should save the gqPositionId and quotationId of quotation details to the local storage', () => {
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
      const filterModels = {
        quotationItemId: { filterType: 'set', values: ['20'] },
      };
      service.setColumnFilters('123', filterModels);

      const expected =
        '{"quotationItemId":{"filterType":"set","values":["20"]}}';
      expect(localStorage.store['123_filterModels']).toEqual(expected);
    });
  });
  describe('getColumnFilters', () => {
    test('should get column filters', () => {
      const filterModels = {
        quotationItemId: { filterType: 'set', values: ['20'] },
      };
      const fakeStore = { '1234_filterModels': JSON.stringify(filterModels) };

      service.localStorage.setStore(fakeStore);

      expect(service.getColumnFilters('1234')).toEqual(filterModels);
    });
  });
});
