import { ColumnState } from '@ag-grid-enterprise/all-modules';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

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
    // tslint:disable-next-line
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    // tslint:disable-next-line: no-dynamic-delete
    delete this.store[key];
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
    localStorage = (spectator.inject(
      LOCAL_STORAGE
    ) as unknown) as LocalStorageMock;

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getColumnState', () => {
    it('should return undefined if theres no entry in localstorage', () => {
      expect(service.getColumnState('any')).toBeUndefined();
    });

    it('should return columns for given key', () => {
      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const fakeStore = { key: JSON.stringify({ columnState }) };

      localStorage.setStore(fakeStore);

      const result = service.getColumnState('key');

      expect(result).toEqual(columnState);
    });
  });

  describe('setColumnsState', () => {
    it('should set the given column state in localstorage', () => {
      service.localStorage.setStore({});

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const expected = '{"columnState":[{"colId":"width","pinned":"left"}]}';

      service.setColumnState('key', columnState);

      expect(localStorage.store.key).toEqual(expected);
    });

    it('should extend localstorage if key is already present', () => {
      const fakeStore = { key: JSON.stringify({ foo: 'bar' }) };

      service.localStorage.setStore(fakeStore);

      const columnState: ColumnState[] = [{ colId: 'width', pinned: 'left' }];
      const expected =
        '{"foo":"bar","columnState":[{"colId":"width","pinned":"left"}]}';

      service.setColumnState('key', columnState);

      expect(localStorage.store.key).toEqual(expected);
    });
  });
});
