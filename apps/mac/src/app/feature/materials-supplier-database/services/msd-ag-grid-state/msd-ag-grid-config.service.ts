import { Injectable } from '@angular/core';

import { BehaviorSubject, filter } from 'rxjs';

import { ColDef } from 'ag-grid-enterprise';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { EDITABLE_MATERIAL_CLASSES } from '@mac/msd/constants/editable-material-classes';
import { STATIC_QUICKFILTERS_MAPPING } from '@mac/msd/main-table/quick-filter/config';
import { COLUMN_DEFINITIONS_MAPPING } from '@mac/msd/main-table/table-config/materials';
import { EDITOR_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';
import { QuickFilter } from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable({
  providedIn: 'root',
})
export class MsdAgGridConfigService {
  private readonly COLUMN_DEFINITIONS_MAPPING = COLUMN_DEFINITIONS_MAPPING;
  private readonly STATIC_QUICKFILTERS_MAPPING = STATIC_QUICKFILTERS_MAPPING;

  private hasEditorRole = false;

  public columnDefinitions$ = new BehaviorSubject<ColDef[]>(
    this.getDefaultColumnDefinitions(
      MaterialClass.STEEL,
      NavigationLevel.MATERIAL
    )
  );

  constructor(private readonly dataFacade: DataFacade) {
    this.init();
  }

  private init(): void {
    this.dataFacade.hasEditorRole$.subscribe((hasEditorRole) => {
      this.hasEditorRole = hasEditorRole;
    });
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

  private isEditable(materialClass: MaterialClass) {
    return (
      this.hasEditorRole && EDITABLE_MATERIAL_CLASSES.includes(materialClass)
    );
  }

  public getDefaultColumnDefinitions(
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel
  ): ColDef[] {
    let colDefs =
      this.COLUMN_DEFINITIONS_MAPPING.materials[materialClass][navigationLevel];
    if (this.isEditable(materialClass)) {
      colDefs = [...EDITOR_COLUMN_DEFINITIONS, ...colDefs];
    }

    return colDefs;
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
