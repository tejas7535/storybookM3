import { TestBed } from '@angular/core/testing';

import { ColumnState } from '@ag-grid-community/all-modules';
import { configureTestSuite } from 'ng-bullet';

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
      const fakeStore = { key: JSON.stringify({ columnState }) };

      mockLocalStorage(fakeStore);

      const result = service.getColumnState('key');

      expect(result).toEqual(columnState);
    });
  });

  describe('setColumnsState', () => {
    it('should set the given column state in localstorage', () => {
      mockLocalStorage({});

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const expected = '{"columnState":[{"colId":"width","pinned":"left"}]}';

      service.setColumnState('key', columnState);

      expect(store.key).toEqual(expected);
    });

    it('should extend localstorage if key is already present', () => {
      const fakeStore = { key: JSON.stringify({ foo: 'bar' }) };

      mockLocalStorage(fakeStore);

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const expected =
        '{"foo":"bar","columnState":[{"colId":"width","pinned":"left"}]}';

      service.setColumnState('key', columnState);

      expect(store.key).toEqual(expected);
    });
  });
});
