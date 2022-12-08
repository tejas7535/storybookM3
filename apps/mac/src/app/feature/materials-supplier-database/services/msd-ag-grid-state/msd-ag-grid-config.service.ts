import { Injectable } from '@angular/core';

import { BehaviorSubject, filter } from 'rxjs';

import { ColDef } from 'ag-grid-enterprise';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { STATIC_QUICKFILTERS_MAPPING } from '@mac/msd/main-table/quick-filter/config';
import { COLUMN_DEFINITIONS_MAPPING } from '@mac/msd/main-table/table-config/materials';
import { QuickFilter } from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable({
  providedIn: 'root',
})
export class MsdAgGridConfigService {
  private readonly COLUMN_DEFINITIONS_MAPPING = COLUMN_DEFINITIONS_MAPPING;
  private readonly STATIC_QUICKFILTERS_MAPPING = STATIC_QUICKFILTERS_MAPPING;

  public columnDefinitions$ = new BehaviorSubject<ColDef[]>(
    this.COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.STEEL][
      NavigationLevel.MATERIAL
    ]
  );

  constructor(private readonly dataFacade: DataFacade) {
    this.init();
  }

  private init(): void {
    this.dataFacade.navigation$
      .pipe(
        filter(({ materialClass, navigationLevel }) =>
          Boolean(materialClass && navigationLevel)
        )
      )
      .subscribe(({ materialClass, navigationLevel }) => {
        this.columnDefinitions$.next(
          this.getDefaultColumnDefinitions(materialClass, navigationLevel)
        );
      });
  }

  public getDefaultColumnDefinitions(
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel
  ): ColDef[] {
    return this.COLUMN_DEFINITIONS_MAPPING.materials[materialClass][
      navigationLevel
    ];
  }

  public getStaticQuickFilters(
    materialClass: MaterialClass = MaterialClass.STEEL,
    navigationLevel: NavigationLevel = NavigationLevel.MATERIAL
  ): QuickFilter[] {
    return this.STATIC_QUICKFILTERS_MAPPING.materials[materialClass][
      navigationLevel
    ];
  }
}
