import { Injectable } from '@angular/core';

import { BehaviorSubject, filter } from 'rxjs';

import { ColDef, ColumnState } from 'ag-grid-enterprise';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { EDITABLE_MATERIAL_CLASSES } from '@mac/msd/constants/editable-material-classes';
import { STATIC_QUICKFILTERS_MAPPING } from '@mac/msd/main-table/quick-filter/config';
import { COLUMN_DEFINITIONS_MAPPING } from '@mac/msd/main-table/table-config/materials';
import { EDITOR_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';
import { QuickFilter } from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';

import { MsdAgGridStateService } from './msd-ag-grid-state.service';

@Injectable({
  providedIn: 'root',
})
export class MsdAgGridConfigService {
  readonly COLUMN_DEFINITIONS_MAPPING = COLUMN_DEFINITIONS_MAPPING;
  readonly STATIC_QUICKFILTERS_MAPPING = STATIC_QUICKFILTERS_MAPPING;

  public columnDefinitions$ = new BehaviorSubject<{
    defaultColumnDefinitions: ColDef[];
    savedColumnState: ColumnState[];
  }>({
    defaultColumnDefinitions: this.getDefaultColumnDefinitions(
      MaterialClass.STEEL,
      NavigationLevel.MATERIAL
    ),
    savedColumnState: this.agGridStateService.getColumnState(),
  });

  private hasEditorRole = false;

  constructor(
    private readonly dataFacade: DataFacade,
    private readonly agGridStateService: MsdAgGridStateService
  ) {
    this.init();
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
        this.columnDefinitions$.next({
          defaultColumnDefinitions: this.getDefaultColumnDefinitions(
            materialClass,
            navigationLevel
          ),
          savedColumnState: this.agGridStateService.getColumnState(),
        });
      });
  }

  private isEditable(materialClass: MaterialClass) {
    return (
      this.hasEditorRole && EDITABLE_MATERIAL_CLASSES.includes(materialClass)
    );
  }
}
