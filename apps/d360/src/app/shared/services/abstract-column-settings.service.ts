import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import {
  ColumnMovedEvent,
  ColumnVisibleEvent,
  DragStoppedEvent,
  FilterChangedEvent,
  SortChangedEvent,
} from 'ag-grid-community';

import { formatFilterModelForBackend } from '../ag-grid/grid-filter-model';

export interface ColumnSetting<COLUMN_KEYS extends string> {
  colId: COLUMN_KEYS;
  visible: boolean;
  sort?: 'asc' | 'desc' | null;
  filterModel?: any;
}

export interface ColumnDefinition<COLUMN_KEYS extends string> {
  colId?: COLUMN_KEYS;
  visible: boolean;
  alwaysVisible: boolean;
  sort?: 'asc' | 'desc' | null;
}

@Injectable()
export abstract class AbstractColumnSettingsService<
  COLUMN_KEYS extends string,
  COLDEF extends ColumnDefinition<COLUMN_KEYS>,
> {
  private readonly columnSettings = new BehaviorSubject<
    (ColumnSetting<COLUMN_KEYS> & COLDEF)[]
  >([]);
  protected abstract tableName: string;
  private readonly columnDefinitions: ColumnDefinition<string>[];

  protected constructor(
    protected readonly http: HttpClient,
    columnDefinitions: ColumnDefinition<string>[]
  ) {
    this.columnDefinitions = columnDefinitions;
  }

  getColumnSettings(): Observable<(ColumnSetting<COLUMN_KEYS> & COLDEF)[]> {
    return this.columnSettings.asObservable();
  }

  protected refreshColumnSettings(): void {
    // Make HTTP request to fetch column settings
    this.http
      .get<
        ColumnSetting<COLUMN_KEYS>[]
      >(`api/user-settings/tables/${this.tableName}/columns`)
      .subscribe((data) => {
        if (data) {
          this.columnSettings.next(this.ensureColumnSettingsValidity(data));
        } else {
          this.columnSettings.next(this.ensureColumnSettingsValidity([]));
        }
      });
  }

  saveColumnSettings(settings: ColumnSetting<COLUMN_KEYS>[]): void {
    this.http
      .post(`api/user-settings/tables/${this.tableName}/columns`, settings)
      .subscribe(() => {
        this.refreshColumnSettings();
      });
  }

  saveFromAgGridEvent(
    event:
      | SortChangedEvent
      | ColumnMovedEvent
      | ColumnVisibleEvent
      | FilterChangedEvent
      | DragStoppedEvent
  ): void {
    const rawFilterModel = event.api.getFilterModel();
    const filterModel =
      rawFilterModel && formatFilterModelForBackend(rawFilterModel);

    const columnState: any[] = event.columnApi
      .getColumnState()
      .map((col: any) => ({
        colId: col.colId,
        visible: !col.hide,
        sort: col.sort,
        filterModel: filterModel && filterModel[col.colId],
      }));
    this.saveColumnSettings(columnState);
  }

  private ensureColumnSettingsValidity(
    columnSettings: ColumnSetting<COLUMN_KEYS>[]
  ): (ColumnSetting<COLUMN_KEYS> & COLDEF)[] {
    const sortMap = Object.fromEntries(
      this.columnDefinitions.map((col, i) => [
        col.colId,
        {
          ...col,
          order: i + columnSettings.length,
        } as ColumnSetting<COLUMN_KEYS> & COLDEF & { order: number },
      ])
    );

    columnSettings
      .filter((col) => sortMap[col.colId])
      .forEach((col, i) => {
        sortMap[col.colId].order = i;
        sortMap[col.colId].visible =
          sortMap[col.colId].alwaysVisible || col.visible;
        sortMap[col.colId].sort = col.sort;
        sortMap[col.colId].filterModel = col.filterModel;
      });

    return Object.values(sortMap).sort(
      (a, b) => (a.order > b.order ? 1 : 0) - (a.order < b.order ? 1 : 0)
    );
  }
}
