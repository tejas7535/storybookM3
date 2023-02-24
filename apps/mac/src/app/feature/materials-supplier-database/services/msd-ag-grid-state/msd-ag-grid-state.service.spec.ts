import { BehaviorSubject } from 'rxjs';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import { ColumnState } from 'ag-grid-community';

import {
  ACTION,
  HISTORY,
  MaterialClass,
  NavigationLevel,
} from '@mac/msd/constants';
import {
  MsdAgGridState,
  MsdAgGridStateCurrent,
  MsdAgGridStateV1,
  MsdAgGridStateV2,
  QuickFilter,
  ViewState,
} from '@mac/msd/models';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialQuickfilterState } from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import { STEEL_STATIC_QUICKFILTERS } from '../../main-table/quick-filter/config/steel';
import { setCustomQuickfilter } from '../../store/actions/quickfilter';
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
      service['migrateLegacyStates'] = jest.fn(() => {});
      service['getMsdMainTableState'] = jest.fn();
      service['migrateLocalStorage'] = jest.fn();

      service['init']();

      expect(service['migrateLegacyStates']).toHaveBeenCalled();
      expect(service['getMsdMainTableState']).toHaveBeenCalled();
      expect(service['migrateLocalStorage']).toHaveBeenCalled();
    });
    it('should react to navigation changes', () => {
      service['getQuickFilterState'] = jest.fn(() => STEEL_STATIC_QUICKFILTERS);

      const subject = new BehaviorSubject({
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      });

      service['quickFilterFacade'].dispatch = jest.fn();
      service['dataFacade'].navigation$ = subject;
      service['init']();

      expect(service['quickFilterFacade'].dispatch).toBeCalledWith(
        setCustomQuickfilter({ filters: STEEL_STATIC_QUICKFILTERS })
      );
    });
    it('should ignore empty navigation', () => {
      service['getQuickFilterState'] = jest.fn(() => STEEL_STATIC_QUICKFILTERS);

      const subject = new BehaviorSubject({
        materialClass: undefined,
        navigationLevel: undefined,
      });

      service['quickFilterFacade'].dispatch = jest.fn();
      service['dataFacade'].navigation$ = subject;
      service['init']();

      expect(service['quickFilterFacade'].dispatch).not.toBeCalled();
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

      service['setMsdMainTableState']({} as MsdAgGridStateCurrent);

      expect(localStorage.setItem).toHaveBeenCalledWith(service['KEY'], '{}');
    });
  });

  describe('migrateLocalStorage', () => {
    let anyMigrationFn: jest.Mock;
    beforeEach(() => {
      // mock all migration functions here
      anyMigrationFn = jest.fn();
      service['migrateToVersion1'] = jest.fn(() => anyMigrationFn());
      service['migrateToVersion2'] = jest.fn(() => anyMigrationFn());
      service['migrateToVersion2_1'] = jest.fn(() => anyMigrationFn());
      service['migrateToVersion2_2'] = jest.fn(() => anyMigrationFn());
      service['migrateToVersion2_3'] = jest.fn(() => anyMigrationFn());
      service['migrateToVersion2_4'] = jest.fn(() => anyMigrationFn());
    });
    it('should run migration to v1', () => {
      service['migrateLocalStorage'](0, { version: 0 } as MsdAgGridState);

      expect(service['migrateToVersion1']).toHaveBeenCalled();
    });

    it('should run migration to v2', () => {
      service['migrateLocalStorage'](1, {} as MsdAgGridState);

      expect(service['migrateToVersion2']).toHaveBeenCalled();
    });

    it('should run migration to v2_1', () => {
      service['migrateLocalStorage'](2, {} as MsdAgGridState);

      expect(service['migrateToVersion2_1']).toHaveBeenCalled();
    });

    it('should run migration to v2_2', () => {
      service['migrateLocalStorage'](2.1, {} as MsdAgGridState);

      expect(service['migrateToVersion2_2']).toHaveBeenCalled();
    });

    it('should run migration to v2_3', () => {
      service['migrateLocalStorage'](2.2, {} as MsdAgGridState);

      expect(service['migrateToVersion2_3']).toHaveBeenCalled();
    });

    it('should run migration to v2_4', () => {
      service['migrateLocalStorage'](2.3, {} as MsdAgGridState);

      expect(service['migrateToVersion2_4']).toHaveBeenCalled();
    });

    it('should not migrate', () => {
      service['migrateLocalStorage'](999, {} as MsdAgGridState);

      expect(anyMigrationFn).not.toHaveBeenCalled();
    });
  });

  describe('migrateLegacyStates', () => {
    it('should migrate the legacy states to version 1 with empty column state key', () => {
      localStorage.store = {
        [service['LEGACY_MSD_QUICKFILTER_KEY']]: '{}',
      };
      localStorage.removeItem = jest.fn();

      const result = service['migrateLegacyStates']();

      expect(result).toEqual({
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
      localStorage.removeItem = jest.fn();

      const result = service['migrateLegacyStates']();

      expect(result).toEqual({
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
      const result = service['migrateToVersion1']();

      expect(result).toEqual({
        version: 1,
        materials: {},
      });
    });
  });

  describe('migrateToVersion2', () => {
    it('should migrate to version 2', () => {
      const defaultViewState: ViewState = {
        columnState: [],
        quickFilters: [],
      };
      const mockViewState: ViewState = {
        columnState: [{} as ColumnState],
        quickFilters: [{} as QuickFilter],
      };
      const mockOldState: MsdAgGridStateV1 = {
        version: 1,
        materials: {
          st: mockViewState,
          al: mockViewState,
          px: mockViewState,
        },
      };

      const expected: MsdAgGridStateV2 = {
        version: 2,
        materials: {
          st: {
            materials: mockViewState,
            suppliers: defaultViewState,
          },
          al: {
            materials: mockViewState,
            suppliers: defaultViewState,
          },
          px: {
            materials: mockViewState,
            suppliers: defaultViewState,
          },
        },
      };

      const result = service['migrateToVersion2'](mockOldState);

      expect(result).toEqual(expected);
    });

    it('should migrate to version 2 with empty state', () => {
      const defaultViewState: ViewState = {
        columnState: [],
        quickFilters: [],
      };
      const mockOldState: MsdAgGridStateV1 = {
        version: 1,
        materials: {},
      };

      const expected: MsdAgGridStateV2 = {
        version: 2,
        materials: {
          st: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          al: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          px: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
        },
      };

      const result = service['migrateToVersion2'](mockOldState);

      expect(result).toEqual(expected);
    });
  });

  describe('migrateToVersion2_1', () => {
    it('should migrate to version 2_1', () => {
      const defaultViewState: ViewState = {
        columnState: [{ colId: 'id' } as ColumnState],
        quickFilters: [],
      };
      const actionView: ViewState = {
        columnState: [
          { colId: ACTION, hide: true },
          { colId: HISTORY, hide: false },
          { colId: 'id' },
        ],
        quickFilters: [],
      };
      const resultView: ViewState = {
        columnState: [
          { colId: ACTION, hide: false },
          { colId: HISTORY, hide: false },
          { colId: 'id' },
        ],
        quickFilters: [],
      };
      const mockOldState: MsdAgGridStateV2 = {
        version: 2,
        materials: {
          st: {
            materials: defaultViewState,
            suppliers: actionView,
          },
          al: {},
          px: {},
        },
      };

      const expected: MsdAgGridStateV2 = {
        version: 2.1,
        materials: {
          st: {
            materials: resultView,
            suppliers: resultView,
            materialStandards: { columnState: [] } as ViewState,
          },
        },
      };

      const result = service['migrateToVersion2_1'](mockOldState);

      expect(result.version).toEqual(expected.version);
      expect(result.materials.st).toEqual(expected.materials.st);
    });
  });

  describe('migrateToVersion2_2', () => {
    it('should migrate to version 2_2', () => {
      const defaultViewState: ViewState = {
        columnState: [],
        quickFilters: [],
      };

      const resultView: ViewState = {
        columnState: [
          { colId: ACTION, hide: false },
          { colId: HISTORY, hide: false },
          { colId: 'id' },
        ],
        quickFilters: [],
      };

      const oldStorage: MsdAgGridStateV2 = {
        version: 2.1,
        materials: {
          st: {
            materials: resultView,
            suppliers: resultView,
            materialStandards: { columnState: [] } as ViewState,
          },
        },
      };

      const expected: MsdAgGridStateV2 = {
        ...oldStorage,
        version: 2.2,
        materials: {
          ...oldStorage.materials,
          cu: {
            materials: defaultViewState,
            suppliers: defaultViewState,
            materialStandards: defaultViewState,
          },
        },
      };

      const result = service['migrateToVersion2_2'](oldStorage);

      expect(result).toEqual(expected);
    });
  });

  describe('getColumnState', () => {
    it('should return the column state for the current material class', () => {
      const defaultViewState: ViewState = {
        columnState: [],
        quickFilters: [],
      };
      const mockFn = jest.fn();
      service['getMsdMainTableState'] = mockFn;
      mockFn.mockReturnValue({
        version: 2,
        materials: {
          st: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          al: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          px: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
        },
      });
      service['materialClass'] = MaterialClass.STEEL;
      service['navigationLevel'] = NavigationLevel.MATERIAL;

      const result = service.getColumnState();

      expect(result).toEqual([]);
    });
  });

  describe('setColumnState', () => {
    it('should set the column state for the current material class', () => {
      const defaultViewState: ViewState = {
        columnState: undefined,
        quickFilters: undefined,
      };
      const mockFn = jest.fn();
      service['getMsdMainTableState'] = mockFn;
      mockFn.mockReturnValue({
        version: 2,
        materials: {
          st: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          al: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          px: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
        },
      });
      service['materialClass'] = MaterialClass.STEEL;
      service['navigationLevel'] = NavigationLevel.MATERIAL;

      service['setMsdMainTableState'] = jest.fn();

      service.setColumnState([]);

      expect(service['setMsdMainTableState']).toHaveBeenCalledWith({
        version: 2,
        materials: {
          st: {
            materials: {
              ...defaultViewState,
              columnState: [],
            },
            suppliers: defaultViewState,
          },
          al: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          px: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
        },
      });
    });
  });

  describe('getQuickFilterState', () => {
    it('should return the quick filter state for the current material class', () => {
      const defaultViewState: ViewState = {
        columnState: [],
        quickFilters: [],
      };
      const mockFn = jest.fn();
      service['getMsdMainTableState'] = mockFn;
      mockFn.mockReturnValue({
        version: 2,
        materials: {
          st: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          al: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          px: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
        },
      });
      service['materialClass'] = MaterialClass.STEEL;
      service['navigationLevel'] = NavigationLevel.MATERIAL;

      const result = service.getQuickFilterState();

      expect(result).toEqual([]);
    });
  });

  describe('setQuickFilterState', () => {
    it('should set the quick filter state for the current material class', () => {
      const defaultViewState: ViewState = {
        columnState: undefined,
        quickFilters: undefined,
      };
      const mockFn = jest.fn();
      service['getMsdMainTableState'] = mockFn;
      mockFn.mockReturnValue({
        version: 2,
        materials: {
          st: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          al: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          px: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
        },
      });
      service['materialClass'] = MaterialClass.STEEL;
      service['navigationLevel'] = NavigationLevel.MATERIAL;

      service['setMsdMainTableState'] = jest.fn();

      service.setQuickFilterState([]);

      expect(service['setMsdMainTableState']).toHaveBeenCalledWith({
        version: 2,
        materials: {
          st: {
            materials: {
              ...defaultViewState,
              quickFilters: [],
            },
            suppliers: defaultViewState,
          },
          al: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
          px: {
            materials: defaultViewState,
            suppliers: defaultViewState,
          },
        },
      });
    });
  });
});
