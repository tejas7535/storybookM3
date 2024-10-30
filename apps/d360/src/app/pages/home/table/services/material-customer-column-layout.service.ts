import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ColumnApi, GridApi } from 'ag-grid-community';

import {
  applyColumnSettings,
  getColumnSettingsFromGrid,
} from '../../../../shared/ag-grid/grid-utils';
import { ColumnSetting } from '../../../../shared/services/abstract-column-settings.service';
import { ColId, CustomerMaterialColumnDefinition } from '../column-definition';
import {
  LAYOUT_IDS,
  LayoutId,
} from '../components/home-table-toolbar/home-table-toolbar.component';

@Injectable({
  providedIn: 'root',
})
export class MaterialCustomerColumnLayoutsService {
  private readonly LOCALSTORAGE_LAYOUT = 'material-customer-selected-layout';

  constructor(private readonly http: HttpClient) {}

  private getStoredLayout(): LayoutId | null {
    const storedLayout = localStorage.getItem(this.LOCALSTORAGE_LAYOUT);

    return storedLayout && LAYOUT_IDS.includes(storedLayout as LayoutId)
      ? (storedLayout as LayoutId)
      : null;
  }

  private storeLayout(newLayout: LayoutId): void {
    localStorage.setItem(this.LOCALSTORAGE_LAYOUT, newLayout);
  }

  public useMaterialCustomerColumnLayouts(
    grid: GridApi | undefined,
    columnApi: ColumnApi
  ) {
    const currentLayoutId: LayoutId = this.getStoredLayout() || '1';
    let initialColumns: Readonly<CustomerMaterialColumnDefinition[]> | null =
      null;

    const layouts: { [key: string]: any } = {
      '1': this.createColumnSettings('material-customer-1'),
      '2': this.createColumnSettings('material-customer-2'),
    };
    const currentLayout = layouts[currentLayoutId];

    if (grid && currentLayout.columns) {
      if (initialColumns) {
        applyColumnSettings(columnApi, currentLayout.columns);
      } else {
        initialColumns = currentLayout.columns;
      }
    }

    return {
      resetLayout: async (newLayoutId: LayoutId) => {
        const newLayout = layouts[newLayoutId];

        if (grid && newLayout.columns) {
          applyColumnSettings(columnApi, newLayout.columns || []);
        }
        await newLayout.save(this.getDefaultColumnSettings());
        this.setCurrentLayoutId(newLayoutId);
      },
      saveLayout: async (newLayoutId: LayoutId) => {
        if (grid) {
          await layouts[newLayoutId].save(
            getColumnSettingsFromGrid<ColId>(columnApi)
          );
          this.setCurrentLayoutId(newLayoutId);
        }
      },
      loadLayout: async (newLayoutId: LayoutId) => {
        if (grid) {
          const newLayout = layouts[newLayoutId];

          if (newLayout.columns) {
            applyColumnSettings(columnApi, newLayout.columns);
          }
          await newLayout.refresh();
          this.setCurrentLayoutId(newLayoutId);
        }
      },
      currentLayoutId,
      initialColumns,
    };
  }

  private async createColumnSettings(tableName: string) {
    this.getColumnSettings(tableName).subscribe((_data) => {});

    return {
      columns: this.getColumnSettings(tableName),
      save: async (settings: any[]) => {
        this.http.post(`user-settings/tables/${tableName}/columns`, {
          settings,
        });
      },
      refresh: async () => {
        // Logic to refresh column settings
      },
    };
  }

  private getColumnSettings(
    tableName: string
  ): Observable<CustomerMaterialColumnDefinition[]> {
    return this.http.get<CustomerMaterialColumnDefinition[]>(
      `api/user-settings/tables/${tableName}/columns`
    );
  }

  private getDefaultColumnSettings(): ColumnSetting<ColId>[] {
    // Logic to get default column settings
    return [];
  }

  private setCurrentLayoutId(layoutId: LayoutId): void {
    this.storeLayout(layoutId);
  }
}
