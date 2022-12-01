import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ColDef } from 'ag-grid-enterprise';

import { MaterialClass } from '@mac/msd/constants';
import {
  ALUMINUM_STATIC_QUICKFILTERS,
  POLYMER_STATIC_QUICKFILTERS,
  STEEL_STATIC_QUICKFILTERS,
} from '@mac/msd/main-table/quick-filter/config';
import {
  ALUMINUM_COLUMN_DEFINITIONS,
  POLYMER_COLUMN_DEFINITIONS,
  STEEL_COLUMN_DEFINITIONS,
} from '@mac/msd/main-table/table-config/materials';
import { QuickFilter } from '@mac/msd/models';
import { fetchCategoryOptions } from '@mac/msd/store/actions';
import { DataFacade } from '@mac/msd/store/facades/data';

@Injectable({
  providedIn: 'root',
})
export class MsdAgGridConfigService {
  private readonly ALUMINUM_COLUMN_DEFINITIONS = ALUMINUM_COLUMN_DEFINITIONS;
  private readonly STEEL_COLUMN_DEFINITIONS = STEEL_COLUMN_DEFINITIONS;
  private readonly POLYMER_COLUMN_DEFINITIONS = POLYMER_COLUMN_DEFINITIONS;

  private readonly ALUMINUM_STATIC_QUICKFILTERS = ALUMINUM_STATIC_QUICKFILTERS;
  private readonly STEEL_STATIC_QUICKFILTERS = STEEL_STATIC_QUICKFILTERS;
  private readonly POLYMER_STATIC_QUICKFILTERS = POLYMER_STATIC_QUICKFILTERS;

  public columnDefinitions$ = new BehaviorSubject<ColDef[]>(
    this.STEEL_COLUMN_DEFINITIONS
  );

  constructor(private readonly dataFacade: DataFacade) {
    this.init();
  }

  private init(): void {
    this.dataFacade.materialClass$.subscribe((materialClass) => {
      this.dataFacade.dispatch(fetchCategoryOptions());
      this.columnDefinitions$.next(
        this.getDefaultColumnDefinitions(materialClass)
      );
    });
  }

  public getDefaultColumnDefinitions(materialClass: MaterialClass): ColDef[] {
    switch (materialClass) {
      case MaterialClass.ALUMINUM:
        return this.ALUMINUM_COLUMN_DEFINITIONS;
      case MaterialClass.STEEL:
        return this.STEEL_COLUMN_DEFINITIONS;
      case MaterialClass.POLYMER:
        return this.POLYMER_COLUMN_DEFINITIONS;
      default:
        return undefined;
    }
  }

  public getStaticQuickFilters(materialClass: MaterialClass): QuickFilter[] {
    switch (materialClass) {
      case MaterialClass.ALUMINUM:
        return this.ALUMINUM_STATIC_QUICKFILTERS;
      case MaterialClass.STEEL:
        return this.STEEL_STATIC_QUICKFILTERS;
      case MaterialClass.POLYMER:
        return this.POLYMER_STATIC_QUICKFILTERS;
      default:
        return undefined;
    }
  }
}
