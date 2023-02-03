import { Inject, Injectable } from '@angular/core';

import { filter } from 'rxjs';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { ColumnState } from 'ag-grid-enterprise';

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
import { setCustomQuickfilter } from '@mac/msd/store/actions/quickfilter';
import { DataFacade } from '@mac/msd/store/facades/data';
import { QuickFilterFacade } from '@mac/msd/store/facades/quickfilter';

@Injectable({
  providedIn: 'root',
})
export class MsdAgGridStateService {
  private readonly MIN_STATE_VERSION = 2.2;
  private readonly KEY = 'MSD_MAIN_TABLE_STATE';
  private readonly LEGACY_MSD_KEY = 'msdMainTable';
  private readonly LEGACY_MSD_QUICKFILTER_KEY = 'MSD_quickfilter';

  private materialClass: MaterialClass = MaterialClass.STEEL;
  private navigationLevel: NavigationLevel = NavigationLevel.MATERIAL;

  constructor(
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage,
    private readonly dataFacade: DataFacade,
    private readonly quickFilterFacade: QuickFilterFacade
  ) {
    this.init();
  }

  private init(): void {
    // always try to convert the legacy states
    let currentStorage: MsdAgGridState =
      this.migrateLegacyStates() || undefined;
    // check if current version is supported, else create a base state
    if (!currentStorage) {
      currentStorage = this.getMsdMainTableState<MsdAgGridState>();
    }
    if ((currentStorage?.version || 0) < this.MIN_STATE_VERSION) {
      this.migrateLocalStorage(currentStorage?.version || 0, currentStorage);
    }

    this.dataFacade.navigation$
      .pipe(
        filter(({ materialClass, navigationLevel }) =>
          Boolean(materialClass && navigationLevel)
        )
      )
      .subscribe(({ materialClass, navigationLevel }) => {
        this.materialClass = materialClass;
        this.navigationLevel = navigationLevel;
        const filters = this.getQuickFilterState();
        this.quickFilterFacade.dispatch(setCustomQuickfilter({ filters }));
      });
    this.quickFilterFacade.quickFilter$
      .pipe(filter((filters) => filters.length > 0))
      .subscribe((filters) => this.setQuickFilterState(filters));
  }

  private getMsdMainTableState<
    T extends MsdAgGridState = MsdAgGridStateCurrent
  >(): T {
    return JSON.parse(this.localStorage.getItem(this.KEY)) as T;
  }

  private setMsdMainTableState(msdMainTableState: MsdAgGridStateCurrent): void {
    this.localStorage.setItem(this.KEY, JSON.stringify(msdMainTableState));
  }

  private migrateLocalStorage(
    version: number,
    currentStorage: MsdAgGridState
  ): void {
    let state: MsdAgGridState = currentStorage;
    if (version < 1) {
      state = this.migrateToVersion1();
    }
    if (version < 2) {
      state = this.migrateToVersion2(state as MsdAgGridStateV1);
    }
    if (version < 2.1) {
      state = this.migrateToVersion2_1(state as MsdAgGridStateV2);
    }
    if (version < 2.2) {
      state = this.migrateToVersion2_2(state as MsdAgGridStateV2);
    }
    // add further migrations here

    this.setMsdMainTableState(state as MsdAgGridStateCurrent);
  }

  private migrateLegacyStates(): MsdAgGridStateV1 | void {
    const legacyMsdState: ColumnState[] = JSON.parse(
      this.localStorage.getItem(this.LEGACY_MSD_KEY)
    );
    const legacyMsdQuickfilterState: QuickFilter[] = JSON.parse(
      this.localStorage.getItem(this.LEGACY_MSD_QUICKFILTER_KEY)
    );

    if (legacyMsdState || legacyMsdQuickfilterState) {
      const newMsdState: MsdAgGridStateV1 = {
        version: 1,
        materials: {
          [MaterialClass.STEEL]: {
            columnState: legacyMsdState ?? undefined,
            quickFilters: legacyMsdQuickfilterState ?? undefined,
          },
        },
      };

      this.localStorage.removeItem(this.LEGACY_MSD_KEY);
      this.localStorage.removeItem(this.LEGACY_MSD_QUICKFILTER_KEY);

      return newMsdState;
    }
  }

  private migrateToVersion1(): MsdAgGridStateV1 {
    const newMsdState: MsdAgGridStateV1 = {
      version: 1,
      materials: {},
    };

    return newMsdState;
  }

  private migrateToVersion2(
    currentStorage: MsdAgGridStateV1
  ): MsdAgGridStateV2 {
    const baseViewState: ViewState = {
      columnState: [],
      quickFilters: [],
    };
    const steelMaterialsViewState = {
      ...baseViewState,
      ...currentStorage.materials.st,
    };
    const aluminumMaterialsViewState = {
      ...baseViewState,
      ...currentStorage.materials.al,
    };
    const polymerMaterialsViewState = {
      ...baseViewState,
      ...currentStorage.materials.px,
    };
    const newMsdState: MsdAgGridStateV2 = {
      version: 2,
      materials: {
        [MaterialClass.STEEL]: {
          [NavigationLevel.MATERIAL]: steelMaterialsViewState,
          [NavigationLevel.SUPPLIER]: baseViewState,
        },
        [MaterialClass.ALUMINUM]: {
          [NavigationLevel.MATERIAL]: aluminumMaterialsViewState,
          [NavigationLevel.SUPPLIER]: baseViewState,
        },
        [MaterialClass.POLYMER]: {
          [NavigationLevel.MATERIAL]: polymerMaterialsViewState,
          [NavigationLevel.SUPPLIER]: baseViewState,
        },
      },
    };

    return newMsdState;
  }

  public migrateToVersion2_1(
    currentStorage: MsdAgGridStateV2
  ): MsdAgGridStateV2 {
    // list of columns required to be visible
    const requiredColumns = [ACTION, HISTORY];

    return {
      ...currentStorage,
      version: 2.1,
      materials: {
        [MaterialClass.STEEL]: {
          [NavigationLevel.MATERIAL]: {
            ...currentStorage.materials[MaterialClass.STEEL][
              NavigationLevel.MATERIAL
            ],
            columnState: this.combineColumnState(
              currentStorage.materials[MaterialClass.STEEL][
                NavigationLevel.MATERIAL
              ]?.columnState,
              requiredColumns
            ),
          },
          [NavigationLevel.STANDARD]: {
            ...currentStorage.materials[MaterialClass.STEEL][
              NavigationLevel.STANDARD
            ],
            columnState: this.combineColumnState(
              currentStorage.materials[MaterialClass.STEEL][
                NavigationLevel.STANDARD
              ]?.columnState,
              requiredColumns
            ),
          },
          [NavigationLevel.SUPPLIER]: {
            ...currentStorage.materials[MaterialClass.STEEL][
              NavigationLevel.SUPPLIER
            ],
            columnState: this.combineColumnState(
              currentStorage.materials[MaterialClass.STEEL][
                NavigationLevel.SUPPLIER
              ]?.columnState,
              requiredColumns
            ),
          },
        },
        [MaterialClass.ALUMINUM]: {
          [NavigationLevel.MATERIAL]: {
            ...currentStorage.materials[MaterialClass.ALUMINUM][
              NavigationLevel.MATERIAL
            ],
            columnState: this.combineColumnState(
              currentStorage.materials[MaterialClass.ALUMINUM][
                NavigationLevel.MATERIAL
              ]?.columnState,
              requiredColumns
            ),
          },
          [NavigationLevel.STANDARD]: {
            ...currentStorage.materials[MaterialClass.ALUMINUM][
              NavigationLevel.STANDARD
            ],
            columnState: this.combineColumnState(
              currentStorage.materials[MaterialClass.ALUMINUM][
                NavigationLevel.STANDARD
              ]?.columnState,
              requiredColumns
            ),
          },
          [NavigationLevel.SUPPLIER]: {
            ...currentStorage.materials[MaterialClass.ALUMINUM][
              NavigationLevel.SUPPLIER
            ],
            columnState: this.combineColumnState(
              currentStorage.materials[MaterialClass.ALUMINUM][
                NavigationLevel.SUPPLIER
              ]?.columnState,
              requiredColumns
            ),
          },
        },
        [MaterialClass.POLYMER]: {
          ...currentStorage.materials[MaterialClass.POLYMER],
        },
      },
    };
  }

  private migrateToVersion2_2(
    currentStorage: MsdAgGridStateV2
  ): MsdAgGridStateV2 {
    const baseViewState: ViewState = {
      columnState: [],
      quickFilters: [],
    };

    return {
      ...currentStorage,
      version: 2.2,
      materials: {
        ...currentStorage.materials,
        [MaterialClass.COPPER]: {
          [NavigationLevel.MATERIAL]: { ...baseViewState },
          [NavigationLevel.SUPPLIER]: { ...baseViewState },
          [NavigationLevel.STANDARD]: { ...baseViewState },
        },
      },
    };
  }

  private combineColumnState(
    lastState: ColumnState[],
    required: string[]
  ): ColumnState[] {
    if (!lastState) {
      return [];
    }
    const existingColumns: Set<string> = new Set(lastState.map((s) => s.colId));
    const requiredSet = new Set(required);

    // check if columns are not yet added
    // create a ColumnState object for each unfound column
    const added = required
      .filter((col) => !existingColumns.has(col))
      .map((col) => ({ colId: col, hide: false } as ColumnState));

    // update all existing lockVisible columns to be visible!
    const newState = lastState.map((s) =>
      requiredSet.has(s.colId) ? { ...s, hide: false } : s
    );

    return [...added, ...newState];
  }

  public getColumnState(): ColumnState[] {
    const msdMainTableState = this.getMsdMainTableState();

    return msdMainTableState.materials[this.materialClass]?.[
      this.navigationLevel
    ]?.columnState;
  }

  public setColumnState(columnState: ColumnState[]): void {
    const msdMainTableState = this.getMsdMainTableState();
    const newMsdMainTableState: MsdAgGridStateCurrent = {
      ...msdMainTableState,
      materials: {
        ...msdMainTableState.materials,
        [this.materialClass]: {
          ...msdMainTableState.materials[this.materialClass],
          [this.navigationLevel]: {
            ...msdMainTableState.materials[this.materialClass][
              this.navigationLevel
            ],
            columnState,
          },
        },
      },
    };

    this.setMsdMainTableState(newMsdMainTableState);
  }

  public getQuickFilterState(): QuickFilter[] {
    const msdMainTableState = this.getMsdMainTableState();

    return (
      msdMainTableState.materials[this.materialClass]?.[this.navigationLevel]
        ?.quickFilters ?? []
    );
  }

  public setQuickFilterState(quickFilters: QuickFilter[]): void {
    const msdMainTableState = this.getMsdMainTableState();
    const newMsdMainTableState: MsdAgGridStateCurrent = {
      ...msdMainTableState,
      materials: {
        ...msdMainTableState.materials,
        [this.materialClass]: {
          ...msdMainTableState.materials[this.materialClass],
          [this.navigationLevel]: {
            ...msdMainTableState.materials[this.materialClass][
              this.navigationLevel
            ],
            quickFilters,
          },
        },
      },
    };

    this.setMsdMainTableState(newMsdMainTableState);
  }
}
