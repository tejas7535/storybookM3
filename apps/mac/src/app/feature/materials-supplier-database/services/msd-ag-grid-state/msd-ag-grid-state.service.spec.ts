import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { MaterialClass } from '@mac/msd/constants';
import { MsdAgGridState } from '@mac/msd/models';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialQuickfilterState } from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import { MsdAgGridStateService } from './msd-ag-grid-state.service';

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

  removeItem(key: string): void {
    this.store[key] = undefined;
  }
}

describe('MsdAgGridStateService', () => {
  let spectator: SpectatorService<MsdAgGridStateService>;
  let service: MsdAgGridStateService;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: MsdAgGridStateService,
    providers: [
      {
        provide: LOCAL_STORAGE,
        useClass: LocalStorageMock,
      },
      provideMockStore({
        initialState: {
          msd: {
            data: { ...initialDataState },
            quickfilter: { ...initialQuickfilterState },
          },
        },
      }),
    ],
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

  describe('init', () => {
    it('should initialize', () => {
      service['migrateLegacyStates'] = jest.fn();
      service['getMsdMainTableState'] = jest.fn();
      service['migrateLocalStorage'] = jest.fn();

      service['init']();

      expect(service['migrateLegacyStates']).toHaveBeenCalled();
      expect(service['getMsdMainTableState']).toHaveBeenCalled();
      expect(service['migrateLocalStorage']).toHaveBeenCalled();
    });
  });

  describe('getMsdMainTableState', () => {
    it('should get the object at the msd key', () => {
      localStorage.getItem = jest.fn(() => '{}');

      const result = service['getMsdMainTableState']();

      expect(result).toEqual({});
      expect(localStorage.getItem).toHaveBeenCalledWith(service['KEY']);
    });
  });

  describe('setMsdMainTableState', () => {
    it('should set the given state', () => {
      localStorage.setItem = jest.fn();

      service['setMsdMainTableState']({} as MsdAgGridState);

      expect(localStorage.setItem).toHaveBeenCalledWith(service['KEY'], '{}');
    });
  });

  describe('migrateLocalStorage', () => {
    it('should run migration to v1', () => {
      service['migrateToVersion1'] = jest.fn();

      service['migrateLocalStorage'](0);

      expect(service['migrateToVersion1']).toHaveBeenCalled();
    });

    it('should not migrate', () => {
      service['migrateToVersion1'] = jest.fn();

      service['migrateLocalStorage'](999);

      expect(service['migrateToVersion1']).not.toHaveBeenCalled();
    });
  });

  describe('migrateLegacyStates', () => {
    it('should migrate the legacy states to version 1 with empty column state key', () => {
      localStorage.store = {
        [service['LEGACY_MSD_QUICKFILTER_KEY']]: '{}',
      };
      service['setMsdMainTableState'] = jest.fn();
      localStorage.removeItem = jest.fn();

      service['migrateLegacyStates']();

      expect(service['setMsdMainTableState']).toHaveBeenCalledWith({
        version: 1,
        materials: {
          st: {
            columnState: undefined,
            quickFilters: {},
          },
        },
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        service['LEGACY_MSD_KEY']
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        service['LEGACY_MSD_QUICKFILTER_KEY']
      );
    });

    it('should migrate the legacy states to version 1 with empty quickfilter key', () => {
      localStorage.store = {
        [service['LEGACY_MSD_KEY']]: '{}',
      };
      service['setMsdMainTableState'] = jest.fn();
      localStorage.removeItem = jest.fn();

      service['migrateLegacyStates']();

      expect(service['setMsdMainTableState']).toHaveBeenCalledWith({
        version: 1,
        materials: {
          st: {
            columnState: {},
            quickFilters: undefined,
          },
        },
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        service['LEGACY_MSD_KEY']
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        service['LEGACY_MSD_QUICKFILTER_KEY']
      );
    });
  });

  describe('migrateToVersion1', () => {
    it('should migrate to version 1', () => {
      service['setMsdMainTableState'] = jest.fn();

      service['migrateToVersion1']();

      expect(service['setMsdMainTableState']).toHaveBeenCalledWith({
        version: 1,
        materials: {},
      });
    });
  });

  describe('getColumnState', () => {
    it('should return the column state for the current material class', () => {
      service['getMsdMainTableState'] = jest.fn(() => ({
        version: 1,
        materials: {
          st: {
            columnState: [],
            quickFilters: undefined,
          },
        },
      }));
      service['materialClass'] = MaterialClass.STEEL;

      const result = service.getColumnState();

      expect(result).toEqual([]);
    });
  });

  describe('setColumnState', () => {
    it('should set the column state for the current material class', () => {
      service['getMsdMainTableState'] = jest.fn(() => ({
        version: 1,
        materials: {},
      }));
      service['materialClass'] = MaterialClass.STEEL;
      service['setMsdMainTableState'] = jest.fn();

      service.setColumnState([]);

      expect(service['setMsdMainTableState']).toHaveBeenCalledWith({
        version: 1,
        materials: {
          st: {
            columnState: [],
          },
        },
      });
    });
  });

  describe('getQuickFilterState', () => {
    it('should return the quick filter state for the current material class', () => {
      service['getMsdMainTableState'] = jest.fn(() => ({
        version: 1,
        materials: {
          st: {
            columnState: undefined,
            quickFilters: [],
          },
        },
      }));
      service['materialClass'] = MaterialClass.STEEL;

      const result = service.getQuickFilterState();

      expect(result).toEqual([]);
    });
  });

  describe('setQuickFilterState', () => {
    it('should set the quick filter state for the current material class', () => {
      service['getMsdMainTableState'] = jest.fn(() => ({
        version: 1,
        materials: {},
      }));
      service['materialClass'] = MaterialClass.STEEL;
      service['setMsdMainTableState'] = jest.fn();

      service.setQuickFilterState([]);

      expect(service['setMsdMainTableState']).toHaveBeenCalledWith({
        version: 1,
        materials: {
          st: {
            quickFilters: [],
          },
        },
      });
    });
  });
});
