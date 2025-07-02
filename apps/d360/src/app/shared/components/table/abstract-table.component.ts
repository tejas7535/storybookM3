/* eslint-disable max-lines */
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import {
  BehaviorSubject,
  EMPTY,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { translate } from '@jsverse/transloco';
import {
  CellClickedEvent,
  ColDef,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SideBarDef,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ToolPanelDef,
} from 'ag-grid-enterprise';

import { columnSideBar, sideBar } from '../../ag-grid/grid-defaults';
import {
  ColumnFilters,
  formatFilterModelForBackend,
} from '../../ag-grid/grid-filter-model';
import {
  applyColumnSettings,
  reopenOverlayIfNeeded,
} from '../../ag-grid/grid-utils';
import { AgGridLocalizationService } from '../../services/ag-grid-localization.service';
import { isProblemDetail } from '../../utils/errors';
import { HttpError } from '../../utils/http-client';
import {
  messageFromSAP,
  SapErrorMessageHeader,
} from '../../utils/sap-localisation';
import { NoDataOverlayComponent } from '../ag-grid/no-data/no-data.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { GridLoadingComponent, TabDialogComponent } from './components';
import {
  IconType,
  OverlayType,
  OverlayTypes,
  RequestType,
  TabAction,
  TableType,
  TableTypes,
} from './enums';
import {
  AllowedCallbacks,
  BackendTableResponse,
  ColumnSetting,
  CustomTreeData,
  DynamicTable,
  NamedColumnDefs,
  RequestParams,
  ServerSideAutoGroupProps,
  TableSetting,
} from './interfaces';
import { TableService } from './services';

/**
 * AbstractTableComponent serves as a base class for table components, providing
 * common functionality and configuration for managing and displaying data in a grid.
 * It integrates with AG Grid and supports both backend and frontend data sources.
 *
 * @export
 * @abstract
 * @class AbstractTableComponent
 */
@Component({ template: '' })
export abstract class AbstractTableComponent implements OnInit {
  /**
   * Specifies the type of data source for the table.
   * Must be either TableType.Backend or TableType.Frontend.
   *
   * @protected
   * @abstract
   * @type {TableTypes}
   * @memberof AbstractTableComponent
   */
  protected abstract type: TableTypes;

  /**
   * The default properties for the table.
   *
   * @protected
   * @abstract
   * @type {GridOptions}
   * @memberof AbstractTableComponent
   */
  protected abstract tableDefaultProps: GridOptions;

  /**
   * Component to display a loading overlay when data is being fetched.
   *
   * @protected
   * @type {typeof GridLoadingComponent}
   * @memberof AbstractTableComponent
   */
  protected readonly loadingOverlayComponent: typeof GridLoadingComponent =
    GridLoadingComponent;

  /**
   * Component to display a "no data" overlay when the table has no rows.
   *
   * @protected
   * @type {typeof NoDataOverlayComponent}
   * @memberof AbstractTableComponent
   */
  protected readonly noRowsOverlayComponent: typeof NoDataOverlayComponent =
    NoDataOverlayComponent;

  /**
   * Service for providing localized text for AG Grid.
   *
   * @private
   * @type {AgGridLocalizationService}
   * @memberof AbstractTableComponent
   */
  private readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);

  /**
   * Angular Material Dialog service for opening dialogs.
   *
   * @private
   * @type {MatDialog}
   * @memberof AbstractTableComponent
   */
  private readonly dialog: MatDialog = inject(MatDialog);

  /**
   * Service for managing table settings and configurations.
   *
   * @protected
   * @type {TableService<string>}
   * @memberof AbstractTableComponent
   */
  protected readonly tableService: TableService<string> = inject(TableService);

  /**
   * Input signal for the table's dynamic configuration.
   *
   * @type {InputSignal<DynamicTable>}
   * @memberof AbstractTableComponent
   */
  public readonly config: InputSignal<DynamicTable> = input.required();

  /**
   * Input signal for a function to fetch data for the table.
   *
   * @memberof AbstractTableComponent
   */
  public getData: InputSignal<
    (
      params?: RequestParams,
      requestType?: RequestType
    ) => Observable<BackendTableResponse | any>
  > = input.required();

  /**
   * This input signal of type behavior subject is used to trigger a reload of the table data.
   *
   * @type {InputSignal<BehaviorSubject<boolean>>}
   * @memberof AbstractTableComponent
   */
  public reload$: InputSignal<BehaviorSubject<boolean>> = input(
    new BehaviorSubject(false)
  );

  /**
   * Signal for tracking the currently active tab in a tabbed table view.
   *
   * @protected
   * @type {WritableSignal<number>}
   * @memberof AbstractTableComponent
   */
  protected activeTab: WritableSignal<number> = signal(0);

  /**
   * Unique identifier for the table, derived from the configuration.
   *
   * @readonly
   * @protected
   * @type {string}
   * @memberof AbstractTableComponent
   */
  protected get tableId(): string {
    if (!this.config()?.table.tableId) {
      throw new Error(
        '[TableWrapper] tableId is not defined in the table configuration.'
      );
    }

    return this.config().table.tableId;
  }

  /**
   * Observable indicating whether the table is currently loading data.
   *
   * @readonly
   * @protected
   * @type {(BehaviorSubject<boolean>
   *     | Observable<boolean>
   *     | null)}
   * @memberof AbstractTableComponent
   */
  protected get isLoading$():
    | BehaviorSubject<boolean>
    | Observable<boolean>
    | null {
    return this.config()?.isLoading$ ?? null;
  }

  /**
   * Determines whether to show a loader for infinite scroll functionality.
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof AbstractTableComponent
   */
  protected get showLoaderForInfiniteScroll(): boolean {
    return this.config()?.showLoaderForInfiniteScroll ?? false;
  }

  /**
   * Indicates whether the table has a toolbar.
   *
   * @readonly
   * @protected
   * @type {NamedColumnDefs[]}
   * @memberof AbstractTableComponent
   */
  protected get columnDefs(): NamedColumnDefs[] {
    return (this.config()?.table?.columnDefs ?? []) as NamedColumnDefs[];
  }

  /**
   * Indicates whether the table has a toolbar.
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof AbstractTableComponent
   */
  protected get hasToolbar(): boolean {
    return this.config()?.hasToolbar ?? false;
  }

  /**
   * Indicates whether the table has a floating filter.
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof AbstractTableComponent
   */
  protected get renderFloatingFilter(): boolean {
    return this.hasToolbar && (this.config()?.renderFloatingFilter ?? false);
  }

  /**
   * A function to be called when the reset filters button is clicked.
   *
   * @readonly
   * @protected
   * @memberof AbstractTableComponent
   */
  protected get customOnResetFilters(): (() => void) | null {
    return this.hasToolbar && (this.config()?.customOnResetFilters ?? null);
  }

  /**
   * A function to get the count of active filters in the table.
   *
   * @readonly
   * @protected
   * @memberof AbstractTableComponent
   */
  protected get customGetFilterCount(): (() => number) | null {
    return this.hasToolbar && (this.config()?.customGetFilterCount ?? null);
  }

  /**
   * Indicates whether the table has a tabbed view.
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof AbstractTableComponent
   */
  protected get hasTabView(): boolean {
    return this.maxAllowedTabs > 0 ? this.config()?.hasTabView || false : false;
  }

  /**
   * The maximum number of tabs allowed in the table.
   *
   * @readonly
   * @protected
   * @type {number}
   * @memberof AbstractTableComponent
   */
  protected get maxAllowedTabs(): number {
    return this.config()?.maxAllowedTabs || 0;
  }

  /**
   * Configuration options for server-side auto-grouping.
   *
   * @readonly
   * @protected
   * @type {(ServerSideAutoGroupProps | null)}
   * @memberof AbstractTableComponent
   */
  protected get serverSideAutoGroup(): ServerSideAutoGroupProps | null {
    return this.config()?.table?.serverSideAutoGroup || null;
  }

  /**
   * Configuration options for custom tree data and groups.
   *
   * @readonly
   * @protected
   * @type {(CustomTreeData | null)}
   * @memberof AbstractTableComponent
   */
  protected get customTreeData(): CustomTreeData | null {
    return this.config()?.table?.customTreeData || null;
  }

  /**
   * The callbacks for the table.
   *
   * @readonly
   * @protected
   * @type {(AllowedCallbacks | null)}
   * @memberof AbstractTableComponent
   */
  protected get callbacks(): AllowedCallbacks | null {
    return this.config()?.callbacks || null;
  }

  /**
   * Configuration options for the AG Grid instance.
   *
   * @protected
   * @type {GridOptions}
   * @memberof AbstractTableComponent
   */
  protected gridOptions: GridOptions | null = null;

  /**
   * Angular platform identifier for determining the runtime environment.
   *
   * @protected
   * @memberof AbstractTableComponent
   */
  protected PLATFORM_ID = inject(PLATFORM_ID);

  /**
   * Indicates whether the application is running in a browser environment.
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof AbstractTableComponent
   */
  protected get isBrowser(): boolean {
    return isPlatformBrowser(this.PLATFORM_ID);
  }

  /**
   * Strategy for automatically sizing columns in the grid.
   *
   * - Leave it empty (undefined) to only call one time autoSizeAllColumns
   * - Set it to false to not call one time autoSizeAllColumns
   * - Set it to one of the strategies to use this strategy
   *
   * @readonly
   * @protected
   * @type {(SizeColumnsToFitGridStrategy
   *     | SizeColumnsToFitProvidedWidthStrategy
   *     | SizeColumnsToContentStrategy
   *     | false
   *     | undefined)}
   * @memberof AbstractTableComponent
   */
  protected get autoSizeStrategy():
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
    | false
    | undefined {
    return this.config()?.table?.autoSizeStrategy ?? undefined;
  }

  /**
   * CSS class for applying a theme to the grid.
   *
   * @readonly
   * @protected
   * @type {string}
   * @memberof AbstractTableComponent
   */
  protected get themeClass(): string {
    return [
      this.config()?.table?.themeClass ?? 'ag-theme-material',
      ...(this.config()?.tableClass ? [this.config()?.tableClass] : []),
    ].join(' ');
  }

  /**
   * API for interacting with the AG Grid instance.
   *
   * @protected
   * @type {(GridApi | undefined)}
   * @memberof AbstractTableComponent
   */
  protected gridApi: GridApi | undefined;

  /**
   * Event stream for notifying when data is fetched.
   * Hint: Pass a new BehaviorSubject from outside to use it in the calling component.
   *
   * @protected
   * @type {InputSignal<
   *     BehaviorSubject<{
   *       rowCount: number;
   *     }>
   *   >}
   * @memberof AbstractTableComponent
   */
  protected readonly dataFetchedEvent$: InputSignal<
    BehaviorSubject<{ rowCount: number }>
  > = input(new BehaviorSubject({ rowCount: 0 }));

  /**
   * Event stream for notifying when a data fetch error occurs.
   * Hint: Pass a new BehaviorSubject from outside to use it in the calling component.
   *
   * @protected
   * @type {InputSignal<BehaviorSubject<any>>}
   * @memberof AbstractTableComponent
   */
  protected readonly fetchErrorEvent$: InputSignal<BehaviorSubject<any>> =
    input(new BehaviorSubject<any>(null));

  /**
   * Angular destroy reference for managing subscriptions and cleanup.
   *
   * @protected
   * @type {DestroyRef}
   * @memberof AbstractTableComponent
   */
  protected destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * Output event for notifying when column filters change.
   *
   * @memberof AbstractTableComponent
   */
  public onColumnFilterChange = output<ColumnFilters>();

  /**
   * Output event for providing the AG Grid API instance.
   *
   * @memberof AbstractTableComponent
   */
  public getGridApi = output<GridApi>();

  /**
   * Flag indicating whether the component has been initialized.
   *
   * @private
   * @memberof AbstractTableComponent
   */
  private initialized = false;

  /**
   * The TableType enum used in the HTML template.
   *
   * @protected
   * @memberof AbstractTableComponent
   */
  protected readonly TableType = TableType;

  /**
   * The current overlay type being displayed in the grid.
   *
   * @protected
   * @type {WritableSignal<OverlayTypes>}
   * @memberof AbstractTableComponent
   */
  protected currentOverlay: WritableSignal<OverlayTypes> = signal(null);

  /**
   * Creates an instance of AbstractTableComponent.
   * Initializes the Component with default grid options and effects.
   *
   * @memberof AbstractTableComponent
   */
  public constructor() {
    effect(() => {
      if (this.config()?.table && this.gridApi) {
        this.setGridOptions();

        // We do only init the table here for the backend table.
        // The frontend table will init in the onGridReady method.
        if (this.type === TableType.Backend) {
          this.init();
        }
      }
    });
  }

  /**
   * Implement this method to add custom initialization logic for startup.
   *
   * @protected
   * @abstract
   * @memberof AbstractTableComponent
   */
  protected abstract init(): void;

  /** @inheritdoc */
  public ngOnInit(): void {
    this.gridOptions = {
      ...this.tableDefaultProps,
      ...(this.autoSizeStrategy
        ? { autoSizeStrategy: this.autoSizeStrategy }
        : {}),
      sideBar: this.getSideBar(),
      onGridReady: (params: GridReadyEvent) => this.onGridReady(params),
      onFilterChanged: (event) => this.saveGridFilters(event),
      onSortChanged: () => this.saveGridSettings(),
      onColumnVisible: () => this.saveGridSettings(),
      onDragStopped: () => this.saveGridSettings(),
      onFirstDataRendered: (event) => this.onFirstDataRendered(event),
      onCellClicked: (event) => this.onCellClicked(event),
      getRowId: (params: GetRowIdParams) => this.getRowId(params),
      localeText: this.agGridLocalizationService.lang(),
      tooltipShowDelay: 0,
    };
  }

  /**
   * Retrieves the row ID for a given row in the grid.
   * This method checks if the row ID is defined in the row data
   * and returns it. If the row ID is not found, an error is thrown.
   * This method is used to uniquely identify rows in the grid.
   * It is important for row selection, editing, and other operations.
   *
   * @protected
   * @param {GetRowIdParams} params - Parameters containing row data.
   * @type {GetRowIdFunc}
   * @return {string} - The unique row ID.
   * @throws {Error} - Throws an error if the row ID cannot be found.
   * @memberof AbstractTableComponent
   */
  protected getRowId: GetRowIdFunc = (params: GetRowIdParams): string => {
    if (this.config()?.table?.getRowId) {
      return this.config().table.getRowId(params);
    }

    if ((params as any).id === undefined && params.data.id === undefined) {
      throw new Error('[TableWrapper] Could not find id in row.');
    } else if (
      (params as any).id !== undefined &&
      (params as any).id !== null
    ) {
      return (params as any).id;
    }

    return params.data.id;
  };

  /**
   * Sets the active tab in the table settings.
   * This method updates the active tab based on the provided ID.
   * It also applies the correct grid options, column state, and filters.
   *
   * @private
   * @param {TableSetting<string>[]} tabs
   * @param {number} id
   * @return {TableSetting<string>[]}
   * @memberof AbstractTableComponent
   */
  private setActiveTab(
    tabs: TableSetting<string>[],
    id: number
  ): TableSetting<string>[] {
    const returnTabs = tabs.map((tab) => {
      tab.active = tab.id === id;

      if (tab.active) {
        this.activeTab.set(tab.id);

        const columns = tab?.columns ?? [];

        // apply the 'correct' grid options
        this.applyGridOptions(tab.defaultSetting);

        // apply the 'correct' column state
        this.applyColumnState(columns, tab.layoutId);

        // apply the 'correct' column filters
        this.applyFilters(columns);
      }

      return tab;
    });

    // If there is no active tab, set the first one as active
    if (returnTabs.filter((tab) => tab.active).length === 0) {
      return this.setActiveTab(returnTabs, returnTabs[0].id);
    }

    return returnTabs;
  }

  /**
   * Applies filters to the grid based on the provided column settings.
   * This method sets the filter model for each column that has a filter defined.
   * It also forces a redraw of the rows to ensure that filtered rows are displayed correctly.
   *
   * @private
   * @param {ColumnSetting<string>[]} columns
   * @memberof AbstractTableComponent
   */
  private applyFilters(columns: ColumnSetting<string>[]): void {
    this.gridApi?.setFilterModel(
      // eslint-disable-next-line unicorn/no-array-reduce
      columns.reduce(
        (result, columnSetting) =>
          columnSetting.filter
            ? {
                ...result,
                [columnSetting.colId]:
                  columnSetting.filterModel || columnSetting.filter,
              }
            : result,
        {}
      )
    );

    // force redraw, otherwise filtered rows sometimes will appear as blank rows
    this.gridApi?.redrawRows();
  }

  /**
   * Applies grid options based on the provided tab settings.
   * This method configures the side bar and default column definitions.
   * It also sets the default column definitions for the grid.
   *
   * @private
   * @param {boolean} isDefaultTab
   * @memberof AbstractTableComponent
   */
  private applyGridOptions(isDefaultTab: boolean): void {
    const toolPanels = [...(this.getSideBar()?.toolPanels ?? [])];

    if (this.config()?.table?.sideBar === undefined) {
      toolPanels.length = 0; // Clear the array

      if (!isDefaultTab) {
        toolPanels.push(columnSideBar);
      }

      toolPanels.push({
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      });
    } else if (isDefaultTab) {
      // Remove column panel for default tab
      const columnPanelIndex = toolPanels.findIndex(
        (panel) => (panel as ToolPanelDef).id === 'columns'
      );
      if (columnPanelIndex !== -1) {
        toolPanels.splice(columnPanelIndex, 1);
      }
    }

    // Set grid option once with the final toolPanels configuration
    this.gridApi?.setGridOption('sideBar', { toolPanels });

    // activate / deactivate movable
    this.gridApi?.setGridOption(
      'columnDefs',
      this.gridApi?.getColumnDefs().map((col: ColDef) => ({
        ...col,
        suppressMovable: isDefaultTab,
        mainMenuItems: isDefaultTab
          ? [
              'sortAscending',
              'sortDescending',
              ...(col?.filter && !!col.filter
                ? ['separator', 'columnFilter']
                : []),
              'separator',
              'autoSizeThis',
              'autoSizeAll',
            ]
          : null,
      }))
    );

    // if there is already an overlay, we show it again, otherwise it will not be shown
    reopenOverlayIfNeeded(this.gridApi, this.currentOverlay());
  }

  /**
   * Retrieves the side bar configuration for the table.
   * This method checks if a custom side bar is defined in the table configuration.
   * If not, it uses the default side bar configuration.
   * If it's a tab view, it returns undefined, because we are then using the side bar automatism in {@link applyColumnState}.
   *
   * @private
   * @return {(SideBarDef | undefined)}
   * @memberof AbstractTableComponent
   */
  private getSideBar(): SideBarDef | undefined {
    if (this.config()?.table?.sideBar) {
      return this.config().table?.sideBar;
    } else if (this.hasTabView) {
      return undefined;
    }

    return sideBar;
  }

  /**
   * Applies the column state to the grid based on the provided column settings.
   * This method sets the visibility and sorting order of each column.
   *
   * @private
   * @param {ColumnSetting<string>[]} columns
   * @param {number} [layoutId]
   * @memberof AbstractTableComponent
   */
  private applyColumnState(
    columns: ColumnSetting<string>[],
    layoutId?: number
  ): void {
    if ([null, '', undefined].includes(layoutId as any)) {
      return;
    }

    applyColumnSettings(
      this.gridApi,
      columns.length > 0
        ? columns
        : (
            this.config()?.table?.initialColumnDefs?.find(
              (colDef) => colDef.layoutId === layoutId
            )?.columnDefs ?? []
          )
            // copy the column definitions to avoid mutating the original array
            .map((columnDef) => ({ ...columnDef }))
            .map(
              (
                colDef: ColDef & {
                  visible?: boolean;
                  alwaysVisible?: boolean;
                  order?: number;
                  filterModel?: any;
                }
              ) => ({
                colId: colDef.colId,
                visible: colDef.visible,
                sort: colDef.sort || null,
                filterModel: colDef.filterModel || undefined,
                filter: colDef.filter || undefined,
                alwaysVisible: colDef.alwaysVisible || undefined,
              })
            )
    );
  }

  /**
   * Handles the click event for a tab in a tabbed table view.
   * This method determines the action to take based on the clicked tab,
   * such as adding, editing, or deleting a tab.
   * It also sets the active tab and saves the table settings.
   *
   * @protected
   * @param {*} $event - The event object containing tab details.
   * @memberof AbstractTableComponent
   */
  protected handleTabClick($event: any): void {
    const tabs = this.tableService.tableSettings$.getValue();

    // check if the add view toggle was clicked and add a new view toggle
    if ([$event?.id, $event?.viewId].includes(TableService.addId)) {
      this.handleTab(TabAction.Add, $event);
    }
    // check if the delete icon was clicked and remove the view toggle
    else if ([$event?.iconName].includes(IconType.Delete)) {
      this.deleteTab($event);
    }
    // check if the delete icon was clicked and remove the view toggle
    else if ([$event?.iconName].includes(IconType.Edit)) {
      this.handleTab(TabAction.Edit, $event);
    }
    // set the given view toggle as active
    else {
      this.tableService.tableSettings$.next(
        this.setActiveTab(
          tabs,
          $event?.id ??
            $event?.viewId ??
            tabs.find((tab) => tab.defaultSetting)?.id ??
            tabs[0].id
        )
      );
      this.tableService.setTableSettings$(this.activeTab()).subscribe();
    }
  }

  /**
   * Handles the addition or editing of a tab in the table view.
   * This method opens a dialog for the user to enter the tab title,
   * and updates the table settings accordingly.
   * - If the action is "Add", a new tab is created.
   * - If the action is "Edit", the existing tab title is updated.
   *
   * @private
   * @param {(TabAction.Add | TabAction.Edit)} action
   * @param {*} $event
   * @memberof AbstractTableComponent
   */
  private handleTab(action: TabAction.Add | TabAction.Edit, $event: any): void {
    let tabs = this.tableService.tableSettings$.getValue();
    const toggle =
      action === TabAction.Edit
        ? (tabs.find((tab) => tab.id === $event?.viewId) ?? null)
        : null;

    this.dialog
      .open(TabDialogComponent, {
        data: {
          title: action === TabAction.Add ? undefined : toggle?.title,
          layoutId:
            action === TabAction.Add
              ? undefined
              : {
                  id: toggle?.layoutId ?? null,
                  text: toggle?.layoutId ?? null,
                },
          layouts: this.columnDefs.map((colDef) => ({
            id: colDef.layoutId || 0,
            text: colDef.title,
          })),
          action,
        },
        disableClose: true,
        autoFocus: false,
        width: '600px',
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap(
          ({ title, layoutId }: { title: string; layoutId: number }) => {
            if (!title || !(layoutId >= 0)) {
              return EMPTY;
            }

            if (action === TabAction.Add) {
              const newIndex = this.getNewTabIndex(tabs);
              tabs.splice(-1, 0, {
                id: newIndex,
                layoutId,
                active: true,
                title,
                defaultSetting: false,
                disabled: false,
                icons: [{ name: IconType.Edit }, { name: IconType.Delete }],
                columns: [],
              });

              tabs = this.setActiveTab(tabs, newIndex);
            } else {
              const element = tabs.find((tab) => tab.id === $event?.viewId);

              if (element) {
                element.title = title;
              }
            }

            tabs = this.checkAddButton(tabs);

            this.tableService.tableSettings$.next(tabs);

            return this.tableService.setTableSettings$(this.activeTab());
          }
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Generates a new tab index based on the existing tabs.
   *
   * @private
   * @param {TableSetting<string>[]} tabs
   * @return {number}
   * @memberof AbstractTableComponent
   */
  private getNewTabIndex(tabs: TableSetting<string>[]): number {
    // Get all tabs that are between the initial default tabs and the add tab
    const customTabs = tabs?.filter((tab) => tab.id < TableService.addId);

    return customTabs?.length > 0
      ? Math.max(...customTabs.map((tab) => tab.id)) + 1
      : 1;
  }

  /**
   * This method checks if the add button should be enabled or disabled.
   *
   * @private
   * @param {TableSetting<string>[]} tabs
   * @return {TableSetting<string>[]}
   * @memberof AbstractTableComponent
   */
  private checkAddButton(tabs: TableSetting<string>[]): TableSetting<string>[] {
    // Check if the number of tabs exceeds the limit
    const customTabs = tabs.filter(
      (tab) => !tab.defaultSetting && tab.id !== TableService.addId
    );

    // Disable the add button if there are 5 or more non-default tabs
    const addButton = tabs.find((tab) => tab.id === TableService.addId);
    if (addButton) {
      addButton.disabled =
        this.maxAllowedTabs <= 0 ||
        customTabs.filter((tab) => !tab.defaultSetting).length >=
          this.maxAllowedTabs;
      addButton.icons = [{ name: IconType.Add, disabled: addButton.disabled }];
    }

    return tabs;
  }

  /**
   * Deletes a tab from the table view.
   * This method opens a confirmation dialog to confirm the deletion,
   * and removes the tab from the table settings if confirmed.
   * It also sets the active tab to the default tab after deletion.
   *
   * @private
   * @param {*} $event
   * @memberof AbstractTableComponent
   */
  private deleteTab($event: any): void {
    let tabs = this.tableService.tableSettings$.getValue();

    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          description: translate('table.dialog.deleteTab'),
        },
        disableClose: true,
        autoFocus: false,
        width: '600px',
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap((wasConfirmed: boolean) => {
          if (wasConfirmed) {
            const index = tabs.findIndex((tab) => tab.id === $event?.viewId);

            if (index > -1) {
              tabs.splice(index, 1);

              tabs = this.checkAddButton(tabs);

              this.tableService.tableSettings$.next(
                this.setActiveTab(
                  tabs,
                  tabs.find((tab) => tab.defaultSetting)?.id ?? tabs[0].id
                )
              );

              return this.tableService.setTableSettings$($event.viewId);
            }
          }

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Sets the grid options based on the table configuration.
   * - This method iterates through the table configuration and applies relevant options to the grid API.
   * - It also initializes the table settings if applicable.
   * - If the table has a tab view, it subscribes to the table settings and sets the active tab.
   * - It also initializes the table serverSideAutoGroup if applicable.
   *
   * @protected
   * @memberof AbstractTableComponent
   */
  protected setGridOptions(): void {
    // set default options
    Object.keys(this.config()?.table ?? {}).forEach((key: any) => {
      if (this.columnDefs?.[0]?.columnDefs) {
        this.gridApi?.setGridOption(
          'columnDefs',
          this.columnDefs?.[0]?.columnDefs
        );

        reopenOverlayIfNeeded(this.gridApi, this.currentOverlay());
      }

      const keyAllowed = [
        'context',
        'defaultColDef',
        'getRowStyle',
        'rowClassRules',
        'headerHeight',
        'cellSelection',
        'suppressCellFocus',
        'loadingOverlayComponentParams',
        'noRowsOverlayComponentParams',
      ].includes(key);

      if (keyAllowed && (this.config()?.table as any)?.[key] !== undefined) {
        this.gridApi?.setGridOption(key, (this.config()?.table as any)?.[key]);
      }
    });

    // set server side auto group options
    if (this.serverSideAutoGroup) {
      Object.keys({ ...this.serverSideAutoGroup }).forEach((key: any) =>
        this.gridApi?.setGridOption(key, (this.serverSideAutoGroup as any)[key])
      );
    }

    // set custom tree data options
    if (this.customTreeData) {
      Object.keys({ ...this.customTreeData }).forEach((key: any) =>
        this.gridApi?.setGridOption(key, (this.customTreeData as any)[key])
      );
    }

    if (this.serverSideAutoGroup || this.customTreeData) {
      this.gridApi?.setGridOption('treeData', true);
    }

    if (this.hasTabView) {
      // set options for layout tabs
      if (
        !!this.config()?.table?.tableId &&
        !!this.config()?.table?.columnDefs
      ) {
        this.tableService.init({
          tableId: this.tableId,
          columnDefinitions: this.columnDefs,
          gridApi: this.gridApi,
          maxAllowedTabs: this.maxAllowedTabs,
        });
      }

      this.tableService.tableSettings$
        .pipe(
          filter(
            (tableSettings) => !!tableSettings && tableSettings?.length > 0
          ),
          take(1),
          tap((tableSettings: TableSetting<string>[]) => {
            const activeTab = tableSettings.find((settings) => settings.active);
            this.activeTab.set(activeTab?.id ?? 0);

            if (tableSettings) {
              this.tableService.tableSettings$.next(
                this.setActiveTab(tableSettings, this.activeTab())
              );
            }
          }),
          finalize(() => (this.initialized = true)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  /**
   * Handles the event when the grid is ready.
   *
   * @protected
   * @param {FirstDataRenderedEvent} event
   * @memberof AbstractTableComponent
   */
  protected onFirstDataRendered(event: FirstDataRenderedEvent): void {
    // resize the grid
    if (!event.api.isDestroyed()) {
      // We do only resize the grid if we are not using the autoSizeStrategy.
      // Otherwise, the grid will resize itself.
      if (this.autoSizeStrategy !== false && !this.autoSizeStrategy?.type) {
        event.api.autoSizeAllColumns();
      }

      if (this.callbacks?.onFirstDataRendered) {
        this.callbacks.onFirstDataRendered(event);
      }
    }
  }

  /**
   * Handles the event when a cell is clicked in the grid.
   *
   * @protected
   * @param {CellClickedEvent} event
   * @memberof AbstractTableComponent
   */
  protected onCellClicked(event: CellClickedEvent): void {
    if (!event.api.isDestroyed() && this.callbacks?.onCellClicked) {
      this.callbacks.onCellClicked(event);
    }
  }

  /**
   * Retrieves the data source for the grid.
   *
   * @protected
   * @return {IServerSideDatasource}
   * @memberof AbstractTableComponent
   */
  protected getDataSource(): IServerSideDatasource {
    return { getRows: () => {} };
  }

  /**
   * Load the tables for the Frontend Tables.
   *
   * @protected
   * @return {void}
   * @memberof AbstractTableComponent
   */
  protected loadData(): void {
    // This method should be implemented in the derived frontend table class
  }

  /**
   * Handles the event when the grid is ready.
   * This method sets the grid API, grid options, and data source.
   * It also subscribes to the loading state and shows/hides the loader
   * based on the loading status.
   * If the table has a tab view, it initializes the table settings.
   * It also sets the grid API in the table configuration.
   * This method is called when the grid is first rendered.
   * It is important for setting up the grid and ensuring that it is ready
   * to display data.
   *
   * @param {GridReadyEvent} params - Parameters containing row data.
   * @memberof AbstractTableComponent
   */
  public onGridReady(params: GridReadyEvent): void {
    // set the GridApi
    this.gridApi = params.api;
    this.getGridApi.emit(this.gridApi);

    if (this.type === TableType.Frontend) {
      this.init();
    }

    this.reload$()
      .pipe(
        tap((reload) => {
          if (!reload) {
            return;
          }

          if (this.type === TableType.Backend) {
            this.gridApi?.refreshServerSide({ purge: true });
          } else if (this.type === TableType.Frontend) {
            this.loadData();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    if (this.config()?.table) {
      this.config().table.gridApi = params.api;
    }

    // set the GridOptions
    this.setGridOptions();

    // set the datasource
    if (this.type === TableType.Backend) {
      this.gridApi?.setGridOption('serverSideDatasource', this.getDataSource());
    }

    // set loader, if needed
    if (this.isLoading$) {
      this.isLoading$
        .pipe(
          tap((isLoading: boolean) =>
            isLoading &&
            !!this.gridApi &&
            !this.gridApi.isDestroyed() &&
            !!this.config()?.table
              ? this.showLoader()
              : this.hideOverlays()
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }

    if (this.callbacks?.onGridReady) {
      this.callbacks.onGridReady(params);
    }
  }

  /**
   * Saves the current grid filters to the backend or local storage.
   * This method emits the filter model to the output event
   * and saves the grid settings.
   * It is called when the filter model changes in the grid.
   * This method is important for persisting the filter state
   * and ensuring that the user's filter preferences are saved.
   * It can be used to restore the filter state when the user returns
   * to the table or when the table is reloaded.
   *
   * @protected
   * @param {FilterChangedEvent} event
   * @memberof AbstractTableComponent
   */
  protected saveGridFilters(event: FilterChangedEvent): void {
    this.onColumnFilterChange.emit(
      formatFilterModelForBackend(event.api.getFilterModel())
    );

    if (this.type === TableType.Frontend) {
      this.dataFetchedEvent$().next({
        rowCount: event.api.getDisplayedRowCount(),
      });
    }

    this.saveGridSettings();
  }

  /**
   * Saves the current grid settings, such as column visibility and sorting.
   *
   * @protected
   * @memberof AbstractTableComponent
   */
  protected saveGridSettings(): void {
    if (this.initialized && this.hasTabView) {
      this.tableService.setTableSettings$(this.activeTab()).subscribe();
    }
  }

  /**
   * Checks if the grid has any active filters.
   *
   * @protected
   * @return {boolean}
   * @memberof AbstractTableComponent
   */
  protected hasFilters(): boolean {
    if (!this.gridApi) {
      return false;
    }

    return Object.keys(this.gridApi.getFilterModel() || {}).length > 0;
  }

  /**
   * Handles errors that occur during data fetching.
   * This method emits an error message to the fetchErrorEvent$ observable
   * and sets the grid API to show an error overlay.
   *
   *
   * @protected
   * @param {unknown} error
   * @param {(IServerSideGetRowsParams | null)} params
   * @return {Observable<never>}
   * @memberof AbstractTableComponent
   */
  protected handleFetchError$(
    error: HttpError,
    params: IServerSideGetRowsParams | null
  ): Observable<never> {
    let errorMessage = this.getCustomError(error);

    if (!errorMessage && isProblemDetail(error?.details)) {
      const values = error?.details?.values ?? {};

      if (values?.[SapErrorMessageHeader.MessageId]) {
        errorMessage = messageFromSAP(
          translate('error.loading_failed'),
          values[SapErrorMessageHeader.MessageNumber],
          values[SapErrorMessageHeader.MessageId],
          values[SapErrorMessageHeader.MessageV1],
          values[SapErrorMessageHeader.MessageV2],
          values[SapErrorMessageHeader.MessageV3],
          values[SapErrorMessageHeader.MessageV4]
        );
      }
    } else if (!errorMessage) {
      errorMessage = translate('error.loading_failed');
    }

    params?.success({ rowData: [], rowCount: 0 });
    this.dataFetchedEvent$().next({ rowCount: 0 });

    this.showMessage(errorMessage);

    return EMPTY;
  }

  /**
   * Displays an overlay message in the grid.
   * This method is called when the grid is empty or when there is an error
   * loading data.
   *
   * @protected
   * @param {string} message
   * @memberof AbstractTableComponent
   */
  protected showMessage(message: string): void {
    this.gridApi?.setGridOption('loading', false);
    this.gridApi?.setGridOption('noRowsOverlayComponentParams', { message });
    this.gridApi?.showNoRowsOverlay();

    this.currentOverlay.set(OverlayType.Message);
  }

  /**
   * Shows the loading overlay in the grid.
   *
   * @protected
   * @memberof AbstractTableComponent
   */
  protected showLoader(): void {
    this.gridApi?.hideOverlay();
    this.gridApi?.setGridOption('loading', true);

    this.currentOverlay.set(OverlayType.Loader);
  }

  /**
   * Hide all overlays in the grid.
   *
   * @protected
   * @memberof AbstractTableComponent
   */
  protected hideOverlays(): void {
    this.gridApi?.setGridOption('loading', false);
    this.gridApi?.hideOverlay();

    this.currentOverlay.set(null);
  }

  /**
   * Retrieves a custom error message based on the provided error.
   *
   * @private
   * @param {HttpError} error
   * @return {string}
   * @memberof AbstractTableComponent
   */
  private getCustomError(error: HttpError): string {
    const fn = this.config()?.table?.customErrorMessageFn;

    return fn && typeof fn === 'function' ? fn(error) : '';
  }
}
