import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { ColumnState } from 'ag-grid-enterprise';

import { MsdAgGridStateService } from './msd-ag-grid-state.service';

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
describe('MsdAgGridStateService', () => {
  let spectator: SpectatorService<MsdAgGridStateService>;
  let service: MsdAgGridStateService;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: MsdAgGridStateService,
    providers: [{ provide: LOCAL_STORAGE, useClass: LocalStorageMock }],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdAgGridStateService);
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
});
