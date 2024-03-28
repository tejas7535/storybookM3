import { BehaviorSubject, of } from 'rxjs';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ColumnState } from 'ag-grid-community';

import {
  ACTION,
  CO2_PER_TON,
  HISTORY,
  LAST_MODIFIED,
  MANUFACTURER,
  MANUFACTURER_SUPPLIER_SAPID,
  MaterialClass,
  NavigationLevel,
  SAP_SUPPLIER_IDS,
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
      provideMockActions(() => of()),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
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

      service['quickFilterFacade'].setLocalQuickFilters = jest.fn();
      service['dataFacade'].navigation$ = subject;
      service['init']();

      expect(service['quickFilterFacade'].setLocalQuickFilters).toBeCalledWith(
        STEEL_STATIC_QUICKFILTERS
      );
    });
    it('should ignore empty navigation', () => {
      service['getQuickFilterState'] = jest.fn(() => STEEL_STATIC_QUICKFILTERS);

      const subject = new BehaviorSubject({
        materialClass: undefined,
        navigationLevel: undefined,
      });

      service['quickFilterFacade'].setLocalQuickFilters = jest.fn();
      service['dataFacade'].navigation$ = subject;
      service['init']();

      expect(
        service['quickFilterFacade'].setLocalQuickFilters
      ).not.toBeCalled();
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
      service['prepareSupportedMaterialClasses'] = jest.fn();
      service['migrateToVersion1'] = jest.fn(() => anyMigrationFn());
      service['migrateToVersion2'] = jest.fn(() => anyMigrationFn());
      service['migrateToVersion2_1'] = jest.fn(() => anyMigrationFn());
      service['migrateToVersion2_6'] = jest.fn(() => anyMigrationFn());
      service['migrateToVersion2_7'] = jest.fn(() => anyMigrationFn());
    });
    it('should run migration to v1', () => {
      service['migrateLocalStorage'](0, { version: 0 } as MsdAgGridState);

      expect(service['migrateToVersion1']).toHaveBeenCalled();
      expect(service['prepareSupportedMaterialClasses']).toHaveBeenCalled();
    });

    it('should run migration to v2', () => {
      service['migrateLocalStorage'](1, {} as MsdAgGridState);

      expect(service['migrateToVersion2']).toHaveBeenCalled();
      expect(service['prepareSupportedMaterialClasses']).toHaveBeenCalled();
    });

    it('should run migration to v2_1', () => {
      service['migrateLocalStorage'](2, {} as MsdAgGridState);

      expect(service['migrateToVersion2_1']).toHaveBeenCalled();
      expect(service['prepareSupportedMaterialClasses']).toHaveBeenCalled();
    });

    it('should run migration to v2_6', () => {
      service['migrateLocalStorage'](2.5, {} as MsdAgGridState);

      expect(service['migrateToVersion2_6']).toHaveBeenCalled();
      expect(service['prepareSupportedMaterialClasses']).toHaveBeenCalled();
    });

    it('should run migration to v2_7', () => {
      service['migrateLocalStorage'](2.6, {} as MsdAgGridState);

      expect(service['migrateToVersion2_7']).toHaveBeenCalled();
      expect(service['prepareSupportedMaterialClasses']).toHaveBeenCalled();
    });

    it('should not migrate', () => {
      service['migrateLocalStorage'](999, {} as MsdAgGridState);

      expect(service['prepareSupportedMaterialClasses']).toHaveBeenCalled();
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
          px: {
            materialStandards: {
              columnState: [],
              quickFilters: [],
            } as ViewState,
          },
        },
      };

      const result = service['migrateToVersion2_1'](mockOldState);

      expect(result.version).toEqual(expected.version);
      expect(result.materials.st).toEqual(expected.materials.st);
      expect(result.materials.px).toEqual(expected.materials.px);
    });
  });

  describe('migrateToVersion2_6', () => {
    it('should migrate to version 2_6', () => {
      const createViewState = (columns: string[]): ViewState => ({
        columnState: columns.map((id) => ({ colId: id }) as ColumnState),
        quickFilters: [],
      });

      const oldStorage: MsdAgGridStateV2 = {
        version: 2.5,
        materials: {
          [MaterialClass.ALUMINUM]: {
            materials: createViewState([ACTION, 'au']),
          },
          [MaterialClass.CERAMIC]: {
            materials: createViewState([HISTORY, 'ce']),
          },
          [MaterialClass.COPPER]: {
            materials: createViewState([ACTION, 'test', 'abc']),
          },
          [MaterialClass.POLYMER]: {
            materials: createViewState([ACTION, HISTORY, 'px']),
          },
          [MaterialClass.SAP_MATERIAL]: {
            materials: createViewState([ACTION, HISTORY]),
          },
          [MaterialClass.STEEL]: {
            materials: createViewState([ACTION, HISTORY, MANUFACTURER]),
          },
        },
      };

      const expected: MsdAgGridStateV2 = {
        ...oldStorage,
        version: 2.6,
        materials: {
          ...oldStorage.materials,
          [MaterialClass.ALUMINUM]: { materials: createViewState(['au']) },
          [MaterialClass.CERAMIC]: { materials: createViewState(['ce']) },
          [MaterialClass.COPPER]: {
            materials: createViewState(['test', 'abc']),
          },
          [MaterialClass.POLYMER]: { materials: createViewState(['px']) },
          [MaterialClass.SAP_MATERIAL]: { materials: createViewState([]) },
          [MaterialClass.STEEL]: { materials: createViewState([MANUFACTURER]) },
        },
      };

      expect(service['migrateToVersion2_6'](oldStorage)).toEqual(expected);
    });
  });

  describe('migrateToVersion2_7', () => {
    it('should migrate to version 2_7', () => {
      const createViewState = (columns: string[]): ViewState => ({
        columnState: columns.map((id) => ({ colId: id }) as ColumnState),
        quickFilters: [
          {
            title: 'test',
            filter: { [columns[0]]: 33 },
            columns,
          },
        ],
      });

      const oldStorage: MsdAgGridStateV2 = {
        version: 2.6,
        materials: {
          [MaterialClass.ALUMINUM]: {
            materials: createViewState([CO2_PER_TON, SAP_SUPPLIER_IDS, 'au']),
            suppliers: createViewState([CO2_PER_TON, SAP_SUPPLIER_IDS, 'au']),
          },
          [MaterialClass.CERAMIC]: {
            materials: createViewState([SAP_SUPPLIER_IDS, LAST_MODIFIED, 'ce']),
            suppliers: createViewState([SAP_SUPPLIER_IDS, LAST_MODIFIED, 'ce']),
          },
          [MaterialClass.COPPER]: {
            materials: createViewState([SAP_SUPPLIER_IDS, CO2_PER_TON, 'abc']),
            suppliers: createViewState([SAP_SUPPLIER_IDS, CO2_PER_TON, 'abc']),
          },
          [MaterialClass.POLYMER]: {
            materials: createViewState([SAP_SUPPLIER_IDS, 'px']),
            suppliers: createViewState([SAP_SUPPLIER_IDS, 'px']),
          },
          [MaterialClass.SAP_MATERIAL]: {
            materials: createViewState([SAP_SUPPLIER_IDS]),
          },
          [MaterialClass.STEEL]: {
            materials: createViewState([
              CO2_PER_TON,
              SAP_SUPPLIER_IDS,
              MANUFACTURER,
            ]),
            suppliers: createViewState([
              CO2_PER_TON,
              SAP_SUPPLIER_IDS,
              MANUFACTURER,
            ]),
          },
        },
      };

      const expected: MsdAgGridStateV2 = {
        ...oldStorage,
        version: 2.7,
        materials: {
          ...oldStorage.materials,
          [MaterialClass.ALUMINUM]: {
            materials: createViewState([
              CO2_PER_TON,
              MANUFACTURER_SUPPLIER_SAPID,
              'au',
            ]),
            suppliers: createViewState([
              CO2_PER_TON,
              MANUFACTURER_SUPPLIER_SAPID,
              'au',
            ]),
          },
          [MaterialClass.CERAMIC]: {
            materials: createViewState([
              MANUFACTURER_SUPPLIER_SAPID,
              LAST_MODIFIED,
              'ce',
            ]),
            suppliers: createViewState([
              MANUFACTURER_SUPPLIER_SAPID,
              LAST_MODIFIED,
              'ce',
            ]),
          },
          [MaterialClass.COPPER]: {
            materials: createViewState([
              MANUFACTURER_SUPPLIER_SAPID,
              CO2_PER_TON,
              'abc',
            ]),
            suppliers: createViewState([
              MANUFACTURER_SUPPLIER_SAPID,
              CO2_PER_TON,
              'abc',
            ]),
          },
          [MaterialClass.POLYMER]: {
            materials: createViewState([MANUFACTURER_SUPPLIER_SAPID, 'px']),
            suppliers: createViewState([MANUFACTURER_SUPPLIER_SAPID, 'px']),
          },
          [MaterialClass.SAP_MATERIAL]: {
            materials: createViewState([SAP_SUPPLIER_IDS]),
          },
          [MaterialClass.STEEL]: {
            materials: createViewState([
              CO2_PER_TON,
              MANUFACTURER_SUPPLIER_SAPID,
              MANUFACTURER,
            ]),
            suppliers: createViewState([
              CO2_PER_TON,
              MANUFACTURER_SUPPLIER_SAPID,
              MANUFACTURER,
            ]),
          },
        },
      };

      expect(service['migrateToVersion2_7'](oldStorage)).toEqual(expected);
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

  describe('storeActiveNavigationLevel', () => {
    it('should store active navigation level', () => {
      const setMsdMainTableStateMock = jest.fn();
      service['setMsdMainTableState'] = setMsdMainTableStateMock;

      const getMsdMainTableStateMock = jest.fn();
      getMsdMainTableStateMock.mockReturnValue({
        version: 2,
        materials: {
          [MaterialClass.ALUMINUM]: {
            [NavigationLevel.MATERIAL]: {
              quickFilters: [],
              columnState: [],
            },
            [NavigationLevel.SUPPLIER]: {
              quickFilters: [],
              columnState: [],
            },
            [NavigationLevel.STANDARD]: {
              quickFilters: [],
              columnState: [],
            },
          },
          [MaterialClass.STEEL]: {
            [NavigationLevel.MATERIAL]: {
              quickFilters: [],
              columnState: [],
            },
            [NavigationLevel.SUPPLIER]: {
              quickFilters: [],
              columnState: [],
            },
            [NavigationLevel.STANDARD]: {
              quickFilters: [],
              columnState: [],
            },
          },
        },
      } as unknown as MsdAgGridState);
      service['getMsdMainTableState'] = getMsdMainTableStateMock;

      service.storeActiveNavigationLevel({
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.STANDARD,
      });

      expect(setMsdMainTableStateMock).toHaveBeenCalledWith({
        version: 2,
        materials: {
          [MaterialClass.ALUMINUM]: {
            [NavigationLevel.MATERIAL]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
            [NavigationLevel.SUPPLIER]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
            [NavigationLevel.STANDARD]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
          },
          [MaterialClass.STEEL]: {
            [NavigationLevel.MATERIAL]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
            [NavigationLevel.SUPPLIER]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
            [NavigationLevel.STANDARD]: {
              quickFilters: [],
              columnState: [],
              active: true,
            },
          },
        } as unknown as MsdAgGridState,
      });
    });
  });

  describe('getLastActiveNavigationLevel', () => {
    it('should get last active navigation level', () => {
      const getMsdMainTableStateMock = jest.fn();
      getMsdMainTableStateMock.mockReturnValue({
        version: 2,
        materials: {
          [MaterialClass.ALUMINUM]: {
            [NavigationLevel.MATERIAL]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
            [NavigationLevel.SUPPLIER]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
            [NavigationLevel.STANDARD]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
          },
          [MaterialClass.STEEL]: {
            [NavigationLevel.MATERIAL]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
            [NavigationLevel.SUPPLIER]: {
              quickFilters: [],
              columnState: [],
              active: false,
            },
            [NavigationLevel.STANDARD]: {
              quickFilters: [],
              columnState: [],
              active: true,
            },
          },
        } as unknown as MsdAgGridState,
      } as unknown as MsdAgGridState);
      service['getMsdMainTableState'] = getMsdMainTableStateMock;

      expect(service.getLastActiveNavigationLevel()).toEqual({
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.STANDARD,
      });
    });
  });
});
