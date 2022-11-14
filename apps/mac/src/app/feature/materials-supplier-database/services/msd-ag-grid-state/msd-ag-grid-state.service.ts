import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { ColumnState } from 'ag-grid-enterprise';

import { MaterialClass } from '@mac/msd/constants';
import { MsdAgGridState, QuickFilter } from '@mac/msd/models';
import { setCustomQuickfilter } from '@mac/msd/store/actions';
import { DataFacade, QuickFilterFacade } from '@mac/msd/store/facades';

@Injectable({
  providedIn: 'root',
})
export class MsdAgGridStateService {
  private readonly MIN_STATE_VERSION = 1;
  private readonly KEY = 'MSD_MAIN_TABLE_STATE';
  private readonly LEGACY_MSD_KEY = 'msdMainTable';
  private readonly LEGACY_MSD_QUICKFILTER_KEY = 'MSD_quickfilter';

  private materialClass: MaterialClass = MaterialClass.STEEL;

  constructor(
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage,
    private readonly dataFacade: DataFacade,
    private readonly quickFilterFacade: QuickFilterFacade
  ) {
    this.init();
  }

  private init(): void {
    // always try to convert the legacy states
    this.migrateLegacyStates();
    // check if current version is supported, else create a base state
    const currentStorage = this.getMsdMainTableState();
    if ((currentStorage?.version || 0) < this.MIN_STATE_VERSION) {
      this.migrateLocalStorage(currentStorage?.version || 0);
    }

    this.dataFacade.materialClass$.subscribe((materialClass) => {
      this.materialClass = materialClass;
      const filters = this.getQuickFilterState();
      this.quickFilterFacade.dispatch(setCustomQuickfilter({ filters }));
    });
    this.quickFilterFacade.quickFilter$.subscribe((filters) =>
      this.setQuickFilterState(filters)
    );
  }

  private getMsdMainTableState(): MsdAgGridState {
    return JSON.parse(this.localStorage.getItem(this.KEY));
  }

  private setMsdMainTableState(msdMainTableState: MsdAgGridState): void {
    this.localStorage.setItem(this.KEY, JSON.stringify(msdMainTableState));
  }

  private migrateLocalStorage(version: number): void {
    if (version < 1) {
      this.migrateToVersion1();
    }
    // add further migrations here
  }

  private migrateLegacyStates(): void {
    const legacyMsdState: ColumnState[] = JSON.parse(
      this.localStorage.getItem(this.LEGACY_MSD_KEY)
    );
    const legacyMsdQuickfilterState: QuickFilter[] = JSON.parse(
      this.localStorage.getItem(this.LEGACY_MSD_QUICKFILTER_KEY)
    );

    if (legacyMsdState || legacyMsdQuickfilterState) {
      const newMsdState: MsdAgGridState = {
        version: 1,
        materials: {
          [MaterialClass.STEEL]: {
            columnState: legacyMsdState ?? undefined,
            quickFilters: legacyMsdQuickfilterState ?? undefined,
          },
        },
      };

      this.setMsdMainTableState(newMsdState);
      this.localStorage.removeItem(this.LEGACY_MSD_KEY);
      this.localStorage.removeItem(this.LEGACY_MSD_QUICKFILTER_KEY);
    }
  }

  private migrateToVersion1(): void {
    const newMsdState: MsdAgGridState = {
      version: 1,
      materials: {},
    };

    this.setMsdMainTableState(newMsdState);
  }

  public getColumnState(): ColumnState[] {
    const msdMainTableState = this.getMsdMainTableState();

    return msdMainTableState.materials[this.materialClass]?.columnState;
  }

  public setColumnState(columnState: ColumnState[]): void {
    const msdMainTableState = this.getMsdMainTableState();
    const newMsdMainTableState = {
      ...msdMainTableState,
      materials: {
        ...msdMainTableState.materials,
        [this.materialClass]: {
          ...msdMainTableState.materials[this.materialClass],
          columnState,
        },
      },
    };

    this.setMsdMainTableState(newMsdMainTableState);
  }

  public getQuickFilterState(): QuickFilter[] {
    const msdMainTableState = this.getMsdMainTableState();

    return msdMainTableState.materials[this.materialClass]?.quickFilters ?? [];
  }

  public setQuickFilterState(quickFilters: QuickFilter[]): void {
    const msdMainTableState = this.getMsdMainTableState();
    const newMsdMainTableState = {
      ...msdMainTableState,
      materials: {
        ...msdMainTableState.materials,
        [this.materialClass]: {
          ...msdMainTableState.materials[this.materialClass],
          quickFilters,
        },
      },
    };

    this.setMsdMainTableState(newMsdMainTableState);
  }
}
