import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { ColumnState } from '../../search/reference-types-table/column-state';
import { SortState } from '../../search/reference-types-table/sort-state';
import { AgGridStateService } from './ag-grid-state.service';

describe('AgGridStateService', () => {
  let service: AgGridStateService;
  let store: any;

  const mockLocalStorage = (newStore: any) => {
    store = newStore;

    /* tslint:disable */
    const mockStore = {
      getItem: (key: string): string => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
    /* tslint:enable */

    // add spies
    spyOn(localStorage, 'getItem').and.callFake(mockStore.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockStore.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockStore.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockStore.clear);

    Object.defineProperty(window, 'localStorage', {
      value: mockStore,
    });
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [AgGridStateService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AgGridStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getColumnState', () => {
    it('should return undefined if theres no entry in localstorage', () => {
      mockLocalStorage({});

      expect(service.getColumnState('any')).toBeUndefined();
    });

    it('should return columns for given key', () => {
      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const fakeStore = { key: JSON.stringify({ columns: columnState }) };

      mockLocalStorage(fakeStore);

      const result = service.getColumnState('key');

      expect(result).toEqual(columnState);
    });
  });

  describe('setColumnsState', () => {
    it('should set the given column state in localstorage', () => {
      mockLocalStorage({});

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const expected = '{"columns":[{"colId":"width","pinned":"left"}]}';

      service.setColumnState('key', columnState);

      expect(store.key).toEqual(expected);
    });

    it('should extend localstorage if key is already present', () => {
      const sortState: SortState[] = [{ colId: 'width', sort: 'asc' }];
      const fakeStore = { key: JSON.stringify({ sort: sortState }) };

      mockLocalStorage(fakeStore);

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const expected =
        '{"sort":[{"colId":"width","sort":"asc"}],"columns":[{"colId":"width","pinned":"left"}]}';

      service.setColumnState('key', columnState);

      expect(store.key).toEqual(expected);
    });
  });

  describe('getSortState', () => {
    it('should return undefined if theres no entry in localstorage', () => {
      mockLocalStorage({});

      expect(service.getSortState('any')).toBeUndefined();
    });

    it('should return sort state for given key', () => {
      const sortState: SortState[] = [{ colId: 'width', sort: 'asc' }];
      const fakeStore = { key: JSON.stringify({ sort: sortState }) };

      mockLocalStorage(fakeStore);

      const result = service.getSortState('key');

      expect(result).toEqual(sortState);
    });
  });

  describe('setSortState', () => {
    it('should set the given sort state in localstorage', () => {
      mockLocalStorage({});

      const sortState: SortState[] = [{ colId: 'width', sort: 'asc' }];
      const expected = '{"sort":[{"colId":"width","sort":"asc"}]}';

      service.setSortState('key', sortState);

      expect(store.key).toEqual(expected);
    });

    it('should extend localstorage if key is already present', () => {
      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const fakeStore = { key: JSON.stringify({ columns: columnState }) };

      mockLocalStorage(fakeStore);

      const sortState: SortState[] = [{ colId: 'width', sort: 'asc' }];
      const expected =
        '{"columns":[{"colId":"width","pinned":"left"}],"sort":[{"colId":"width","sort":"asc"}]}';

      service.setSortState('key', sortState);

      expect(store.key).toEqual(expected);
    });
  });
});
