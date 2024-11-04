import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import {
  ColumnVisibleEvent,
  DragStoppedEvent,
  FilterChangedEvent,
  GridApi,
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
  /**
   * The DestroyRef instance used for takeUntilDestroyed().
   *
   * @private
   * @type {DestroyRef}
   * @memberof AbstractColumnSettingsService
   */
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

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

  protected refreshColumnSettings$(): Observable<ColumnSetting<COLUMN_KEYS>[]> {
    // Make HTTP request to fetch column settings
    return this.http
      .get<
        ColumnSetting<COLUMN_KEYS>[]
      >(`api/user-settings/tables/${this.tableName}/columns`)
      .pipe(
        tap((data) => {
          if (data) {
            this.columnSettings.next(this.ensureColumnSettingsValidity(data));
          } else {
            this.columnSettings.next(this.ensureColumnSettingsValidity([]));
          }
        })
      );
  }

  saveColumnSettings$(
    settings: ColumnSetting<COLUMN_KEYS>[]
  ): Observable<ColumnSetting<COLUMN_KEYS>[]> {
    return this.http
      .post(`api/user-settings/tables/${this.tableName}/columns`, settings)
      .pipe(switchMap(() => this.refreshColumnSettings$()));
  }

  loadColumnSettings$(): Observable<ColumnSetting<COLUMN_KEYS>[]> {
    return this.http.get<ColumnSetting<COLUMN_KEYS>[]>(
      `api/user-settings/tables/${this.tableName}/columns`
    );
  }

  saveFromAgGridEvent(
    event:
      | SortChangedEvent
      | ColumnVisibleEvent
      | FilterChangedEvent
      | DragStoppedEvent
  ): void {
    const rawFilterModel = event.api.getFilterModel();
    const filterModel =
      rawFilterModel && formatFilterModelForBackend(rawFilterModel);

    of(
      event.columnApi.getColumnState().map((col: any) => ({
        colId: col.colId,
        visible: !col.hide,
        sort: col.sort,
        filterModel: filterModel && filterModel[col.colId],
      }))
    )
      .pipe(
        distinctUntilChanged(undefined, (data) => JSON.stringify(data)),
        take(1), // only trigger once, if same
        switchMap((columnState: any) => this.saveColumnSettings$(columnState)),
        take(1), // only trigger once, switchMap created a "new" Observable
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Apply the already stored filters
   * Example Code: {@link AlertRuleTableComponent.onFirstDataRendered}
   * @example  HTML: <ag-grid-angular (firstDataRendered)="onFirstDataRendered($event) />
   *
   * @param {GridApi} gridApi
   * @memberof AbstractColumnSettingsService
   */
  public applyStoredFilters(gridApi: GridApi): void {
    this.columnSettings
      .pipe(
        filter((data) => !!data),
        take(1),
        tap((data) => {
          gridApi.setFilterModel(
            // eslint-disable-next-line unicorn/no-array-reduce
            data.reduce(
              (result, columnSetting) => ({
                ...result,
                [columnSetting.colId]: columnSetting.filterModel,
              }),
              {}
            )
          );
          // force redraw, otherwise filtered rows sometimes will appear as blank rows
          gridApi.redrawRows();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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
