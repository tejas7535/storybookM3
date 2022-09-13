import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { QuickFilter } from '../../models';
import { initialState as qfInitialState } from '../../store/reducers/quickfilter/quickfilter.reducer';
import { MsdQuickfilterStateService } from './msd-quickfilter-state.service';

class LocalStorageMock {
  public store: { [key: string]: string } = {};

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
describe('MsdQuickfilterStateService', () => {
  let spectator: SpectatorService<MsdQuickfilterStateService>;
  let service: MsdQuickfilterStateService;
  let localStorage: LocalStorageMock;

  const initialState = {
    msd: {
      quickfilter: qfInitialState,
      data: {
        agGridColumns: '',
        filter: '',
      },
    },
  };

  const createService = createServiceFactory({
    service: MsdQuickfilterStateService,
    providers: [
      { provide: LOCAL_STORAGE, useClass: LocalStorageMock },
      provideMockStore({ initialState }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdQuickfilterStateService);
    localStorage = spectator.inject(
      LOCAL_STORAGE
    ) as unknown as LocalStorageMock;

    localStorage.clear();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getQuickFilterState', () => {
    test('should return [] without updates', () => {
      expect(service['getQuickFilterState']()).toStrictEqual([]);
    });

    test('should return stored values', () => {
      const obj = {} as QuickFilter;
      localStorage.setItem('MSD_quickfilter', JSON.stringify([obj]));

      expect(service['getQuickFilterState']()).toStrictEqual([{}]);
    });
  });
  describe('setQuickFilterState', () => {
    it('should store values', () => {
      const obj = {} as QuickFilter;
      service['storeQuickfilterState']([obj]);

      expect(localStorage.getItem('MSD_quickfilter')).toBe(
        JSON.stringify([{}])
      );
    });
  });
});
