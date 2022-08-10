import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ColumnState } from 'ag-grid-enterprise';

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

  describe('getColumnState', () => {
    test('should return null if theres no entry in localstorage', () => {
      expect(service.getColumnState('any')).toBeNull();
    });

    test('should return columns for given key', () => {
      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const fakeStore = { key: JSON.stringify(columnState) };

      localStorage.setStore(fakeStore);

      const result = service.getColumnState('key');

      expect(result).toEqual(columnState);
    });
  });

  describe('setColumnsState', () => {
    test('should set the given column state in localstorage', () => {
      service.localStorage.setStore({});

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const expected = '[{"colId":"width","pinned":"left"}]';

      service.setColumnState('key', columnState);

      expect(localStorage.store.key).toEqual(expected);
    });

    test('should extend localstorage if key is already present', () => {
      const fakeStore = { key: JSON.stringify({ foo: 'bar' }) };

      service.localStorage.setStore(fakeStore);

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const expected = '[{"colId":"width","pinned":"left"}]';

      service.setColumnState('key', columnState);

      expect(localStorage.store.key).toEqual(expected);
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
