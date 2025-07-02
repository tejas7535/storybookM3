/* eslint-disable max-lines */
import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  EMPTY,
  map,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { translate } from '@jsverse/transloco';
import { ColDef, ColumnState, GridApi } from 'ag-grid-enterprise';

import { formatFilterModelForBackend } from '../../../ag-grid/grid-filter-model';
import { IconType } from '../enums';
import { ColumnSetting, NamedColumnDefs, TableSetting } from '../interfaces';

/**
 * Service for managing table settings, including column configurations,
 * filter models, and table-specific metadata. This service provides
 * functionality to initialize table settings, save them, and load them
 * from a backend API. It also handles the application of column settings
 * to ensure proper ordering and visibility of columns.
 *
 * @export
 * @class TableService
 * @template COLUMN_KEYS - A string literal type representing the keys of the columns.
 */
@Injectable()
export class TableService<COLUMN_KEYS extends string> {
  /**
   * The URL endpoint for the table settings API.
   *
   * @private
   * @type {string}
   * @memberof TableService
   */
  private readonly URL: string = 'api/user-settings/tables/';

  /**
   * The ReplaySubject that holds the data to be saved.
   *
   * @private
   * @type {ReplaySubject<TableSetting<COLUMN_KEYS>[]>}
   * @memberof TableService
   */
  private readonly dataToSave$: ReplaySubject<TableSetting<COLUMN_KEYS>[]> =
    new ReplaySubject<TableSetting<COLUMN_KEYS>[]>(1);

  /**
   * The BehaviorSubject that holds the current table settings.
   *
   * @type {BehaviorSubject<TableSetting<COLUMN_KEYS>[]>}
   * @memberof TableService
   */
  public readonly tableSettings$: BehaviorSubject<TableSetting<COLUMN_KEYS>[]> =
    new BehaviorSubject<TableSetting<COLUMN_KEYS>[]>([]);

  /**
   * The DestroyRef instance used for managing the lifecycle of the service.
   *
   * @protected
   * @type {DestroyRef}
   * @memberof TableService
   */
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * The HttpClient instance used for making HTTP requests.
   *
   * @protected
   * @type {HttpClient}
   * @memberof TableService
   */
  protected readonly http: HttpClient = inject(HttpClient);

  /**
   * The table ID used to identify the table settings.
   *
   * @private
   * @type {(string | undefined)}
   * @memberof TableService
   */
  private _tableId: string | undefined;

  /**
   * The grid API instance used for interacting with the ag-Grid component.
   *
   * @private
   * @type {(GridApi | undefined)}
   * @memberof TableService
   */
  private _gridApi: GridApi | undefined;

  /**
   * The column definitions used for the table.
   *
   * @private
   * @type {NamedColumnDefs[]}
   * @memberof TableService
   */
  private _columnDefinitions: NamedColumnDefs[];

  /**
   * The ID used for the "Add" tab in the table settings.
   *
   * @static
   * @memberof TableService
   */
  public static readonly addId = 999_999;

  /**
   * The maximum number of tabs allowed in the table.
   *
   * @type {number}
   * @memberof TableService
   */
  private maxAllowedTabs: number;

  /**
   * The table ID used to identify the table settings.
   *
   * @readonly
   * @private
   * @type {string}
   * @memberof TableService
   */
  private get tableId(): string {
    if (!this._tableId) {
      throw new Error(
        '[TableWrapper] Table ID was not set. Please set the table ID before using it.'
      );
    }

    return this._tableId;
  }

  /**
   * The column definitions used for the table.
   *
   * @readonly
   * @private
   * @type {NamedColumnDefs[]}
   * @memberof TableService
   */
  private get columnDefinitions(): NamedColumnDefs[] {
    if (!this._columnDefinitions) {
      throw new Error(
        '[TableWrapper] Column definitions were not set. Please set the column definitions before using it.'
      );
    }

    return this._columnDefinitions;
  }

  /**
   * The grid API instance used for interacting with the ag-Grid component.
   *
   * @readonly
   * @private
   * @type {GridApi}
   * @memberof TableService
   */
  private get gridApi(): GridApi {
    if (!this._gridApi) {
      throw new Error(
        '[TableWrapper] Grid API was not set. Please set the grid API before using it.'
      );
    }

    return this._gridApi;
  }

  /**
   * The init function to initialize the table settings service.
   * It also loads the table settings from the backend API.
   *
   * @param {string} tableId
   * @param {NamedColumnDefs[]} columnDefinitions
   * @param {GridApi} gridApi
   * @memberof TableService
   */
  public init({
    tableId,
    columnDefinitions,
    gridApi,
    maxAllowedTabs,
  }: {
    tableId: string;
    columnDefinitions: NamedColumnDefs[];
    gridApi: GridApi;
    maxAllowedTabs: number;
  }): void {
    this._tableId = tableId;
    this._columnDefinitions = columnDefinitions;
    this._gridApi = gridApi;
    this.maxAllowedTabs = maxAllowedTabs;

    this.loadTableSettings$().subscribe();

    this.dataToSave$
      .pipe(
        debounceTime(100),
        switchMap((tableSettings) =>
          this.http
            .post<TableSetting<COLUMN_KEYS>[] | null>(
              `${this.URL}${this.tableId}`,
              tableSettings.filter(
                (settings) => ![TableService.addId].includes(settings.id)
              )
            )
            // This catchError operator is used to make sure that the save logic still works
            // even if the backend API returns an error.
            // otherwise, the observable would complete and the subscription would be unsubscribed.
            .pipe(catchError(() => EMPTY))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Saves the current table settings to the backend API.
   *
   * @param {number} index
   * @return {(Observable<unknown>)}
   * @memberof TableService
   */
  public setTableSettings$(index: number): Observable<unknown> {
    const rawFilterModel = this.gridApi.getFilterModel();
    const filterModel =
      rawFilterModel && formatFilterModelForBackend(rawFilterModel);

    return combineLatest([
      of(
        this.gridApi.getColumnState().map(
          (col: ColumnState): ColumnSetting<COLUMN_KEYS> => ({
            colId: col.colId as COLUMN_KEYS,
            visible: !col.hide,
            sort: col.sort,
            filter: filterModel?.[col.colId],
          })
        )
      ),
      this.tableSettings$,
    ]).pipe(
      take(1),
      tap(
        ([columnState, tableSettings]: [
          ColumnSetting<COLUMN_KEYS>[],
          TableSetting<COLUMN_KEYS>[],
        ]) => {
          (
            tableSettings.find((settings) => settings.id === index) ??
            tableSettings.find(
              (settings) =>
                settings.id ===
                (tableSettings.find((setting) => setting.defaultSetting)?.id ??
                  tableSettings[0].id)
            )
          ).columns = [...columnState];

          const newData = [...(tableSettings ?? [])];

          this.dataToSave$.next(newData);
          this.tableSettings$.next(newData);
        }
      ),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  /**
   * Maps the table settings to the correct format.
   *
   * @private
   * @param {TableSetting<COLUMN_KEYS>[]} tableSettings
   * @return {TableSetting<COLUMN_KEYS>[]}
   * @memberof TableService
   */
  private mapToTableSettings(
    tableSettings: TableSetting<COLUMN_KEYS>[]
  ): TableSetting<COLUMN_KEYS>[] {
    return (
      tableSettings
        // we sort out non existing ids
        .filter((settings) => settings.id >= 0)
        .map((settings) => ({
          id: settings.id,
          layoutId: settings.layoutId || 0,
          active: settings.active || false,
          title: settings.title || '',
          disabled: settings.disabled || false,
          defaultSetting: settings.defaultSetting || false,
          icons: settings?.icons?.map((icon) => ({
            name: icon.name || '',
            disabled: icon.disabled || false,
          })) ?? [{ name: IconType.Edit }, { name: IconType.Delete }],
          columns: settings.columns.map((column) => ({
            colId: column.colId,
            visible: column.visible || false,
            sort: column.sort || null,
            filterModel: column.filterModel || null,
            filter: column.filter || null,
          })),
        }))
    );
  }

  /**
   * Loads the table settings from the backend API.
   *
   * @private
   * @return {(Observable<TableSetting<COLUMN_KEYS>[] | null>)}
   * @memberof TableService
   */
  private loadTableSettings$(): Observable<TableSetting<COLUMN_KEYS>[] | null> {
    // Make HTTP request to fetch column settings
    return this.http
      .get<TableSetting<COLUMN_KEYS>[] | null>(`${this.URL}${this.tableId}`)
      .pipe(
        catchError(() => of([])),
        map(this.mapToTableSettings.bind(this)),
        map((settings) => {
          const missingDefaults = this.getMissingDefaults(settings);

          return [
            // add all missing default settings (first time on page or if there are new default settings)
            ...this.columnDefinitions
              .filter((colDef) => missingDefaults.includes(colDef.layoutId))
              .map((columnDefinitions) => ({
                id: columnDefinitions.layoutId,
                layoutId: columnDefinitions.layoutId,
                active: false,
                title: columnDefinitions.title || translate('table.defaultTab'),
                defaultSetting: true,
                disabled: false,
                icons: [{ name: IconType.Lock, disabled: true }],
                columns: [] as any,
              })),
            ...settings.map((setting) => {
              // Set the new title for the default setting
              // if the setting is not the default setting and the title is the default title
              // this could be necessary if the default tabs were changed from a single default tab to multiple default tabs
              // or if the default tab was renamed
              if (setting.defaultSetting) {
                const colDefTitle = this.columnDefinitions.find(
                  (colDef) => colDef.layoutId === setting.layoutId
                )?.title;

                setting.title =
                  colDefTitle && colDefTitle !== setting.title
                    ? colDefTitle
                    : setting.title;
              }

              return { ...setting };
            }),
            {
              id: TableService.addId,
              active: false,
              defaultSetting: false,
              disabled:
                this.maxAllowedTabs <= 0 ||
                settings?.filter((tab) => !tab.defaultSetting)?.length >=
                  this.maxAllowedTabs,
              icons: [{ name: IconType.Add }],
              columns: [],
            },
          ];
        }),
        tap((tableSettings: TableSetting<COLUMN_KEYS>[]) => {
          this.tableSettings$.next(
            (tableSettings || [])
              .sort(
                (
                  a: TableSetting<COLUMN_KEYS>,
                  b: TableSetting<COLUMN_KEYS>
                ) => {
                  // Sort defaultSetting = true items first
                  if (a.defaultSetting && !b.defaultSetting) {
                    return -1;
                  }
                  if (!a.defaultSetting && b.defaultSetting) {
                    return 1;
                  }

                  // If both have the same defaultSetting value, sort by id
                  return a.id - b.id;
                }
              )
              .map((settings: TableSetting<COLUMN_KEYS>) => ({
                ...settings,
                columns: this.applyColumnSettings(
                  (this.columnDefinitions.find(
                    (columnDefinition) =>
                      columnDefinition.layoutId === settings.layoutId
                  )?.columnDefs ??
                    this.columnDefinitions?.[0]?.columnDefs ??
                    []) as (ColumnSetting<COLUMN_KEYS> & ColDef)[],

                  settings.columns && settings.columns.length > 0
                    ? settings.columns
                    : []
                ),
              }))
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      );
  }

  /**
   * Checks if there are any missing default settings in the provided
   * table settings. It compares the layout IDs in the column definitions
   * with the layout IDs in the settings and returns an array of missing
   * layout IDs. If no settings exist or if all default settings are present,
   * it returns an array of all layout IDs from the column definitions.
   *
   * @private
   * @param {(TableSetting<COLUMN_KEYS>[] | null)} settings
   * @return {number[]}
   * @memberof TableService
   */
  private getMissingDefaults(
    settings: TableSetting<COLUMN_KEYS>[] | null
  ): number[] {
    const defaultIds = this.columnDefinitions.map((colDef) => colDef.layoutId);

    if (
      // If no settings exist, return true (missing defaults)
      !settings ||
      settings.length === 0 ||
      // Check if there's no default setting at all
      !settings.some((setting) => setting.defaultSetting)
    ) {
      return defaultIds;
    }

    // Check if all layouts from columnDefinitions are present in settings
    const layoutIdsInSettings = new Set(
      settings
        .filter((setting) => setting.defaultSetting)
        .map((setting) => setting.layoutId)
    );
    const missingLayoutIds = defaultIds.filter(
      (layoutId) => !layoutIdsInSettings.has(layoutId)
    );

    // If any layout IDs from columnDefinitions are missing in settings, return true
    return missingLayoutIds;
  }

  /**
   * Applies user-defined column settings to the base column definitions.
   * This method merges and organizes columns based on user preferences while
   * preserving visibility constraints, sorting, and filtering settings.
   *
   * @private
   * @param {(ColumnSetting<COLUMN_KEYS> & ColDef)[]} columnDefinitions - Base column definitions
   * @param {ColumnSetting<COLUMN_KEYS>[]} columnSettings - User's custom column settings
   * @return {(ColumnSetting<COLUMN_KEYS> & ColDef)[]} Merged and ordered column definitions
   */
  private applyColumnSettings(
    columnDefinitions: (ColumnSetting<COLUMN_KEYS> & ColDef)[],
    columnSettings: ColumnSetting<COLUMN_KEYS>[]
  ): (ColumnSetting<COLUMN_KEYS> & ColDef)[] {
    const sortMap = Object.fromEntries(
      columnDefinitions.map((column, index) => [
        column.colId,
        { ...column, order: index + (columnSettings?.length ?? 0) },
      ])
    );

    columnSettings
      ?.filter((column) => sortMap[column.colId])
      ?.forEach((column, i) => {
        const colId: string = column.colId as string;
        sortMap[colId].order = i;
        sortMap[colId].visible = sortMap[colId].alwaysVisible || column.visible;
        sortMap[colId].sort = column.sort;
        sortMap[colId].filterModel = column.filter;
      });

    return (
      Object.values(sortMap)
        .sort((a, b) => a.order - b.order)
        // eslint-disable-next-line unused-imports/no-unused-vars
        .map(({ order, ...columnProps }) => columnProps)
    );
  }
}
