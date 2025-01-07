/* eslint-disable max-lines */
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ColumnState } from 'ag-grid-enterprise';

import { ViewToggle } from '@schaeffler/view-toggle';

import {
  CustomView,
  FilterState,
  GridState,
} from '../../models/grid-state.model';
import { QuotationDetail } from '../../models/quotation-detail';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { GridLocalStorageService } from './grid-local-storage.service';
import { GridMergeService } from './grid-merge.service';

@Injectable({
  providedIn: 'root',
})
export class AgGridStateService {
  DEFAULT_VIEW_ID = 0;

  views: BehaviorSubject<ViewToggle[]> = new BehaviorSubject<ViewToggle[]>([]);
  columnState: BehaviorSubject<ColumnState[]> = new BehaviorSubject<
    ColumnState[]
  >([]);
  filterState: BehaviorSubject<FilterState[]> = new BehaviorSubject<
    FilterState[]
  >([]);

  private activeTableKey: string;
  private activeViewId = this.DEFAULT_VIEW_ID;
  private columnIds: string[];

  private readonly gridMergeService: GridMergeService =
    inject(GridMergeService);
  private readonly gridLocalStorageService: GridLocalStorageService = inject(
    GridLocalStorageService
  );
  private readonly localStorageService: LocalStorageService =
    inject(LocalStorageService);

  /**
   * Init the gridState by table key.
   * Optionally customViews can be passed initially, which will be added to the default view.
   * When table key is not present in localStorage, it will be created.
   *
   * @param tableName key of the table
   * @param additionalViews all custom views but the default one
   * @param columnIds columnIds of ColumnDefinitions configured in the app
   */
  public init(
    tableName: string,
    additionalViews?: CustomView[],
    columnIds?: string[]
  ) {
    this.activeTableKey = `GQ_${tableName.toUpperCase()}_STATE`;
    const gridState = this.gridLocalStorageService.getGridState(
      this.activeTableKey
    );

    if (!gridState) {
      this.gridLocalStorageService.createInitialLocalStorage(
        this.activeTableKey,
        additionalViews,
        columnIds
      );
    } else if (gridState && columnIds) {
      this.columnIds = columnIds;
      // check if initalColumnIds are present in the GridState, if not, add them,
      // required because this new property will not be in old versions of the gridState
      if (!gridState.initialColIds || gridState.initialColIds?.length === 0) {
        this.saveGridState({
          ...gridState,
          initialColIds: columnIds,
        });
      }
      // check whether columns are in State but not in Config
      this.cleanupRemovedColumns(gridState);
    }

    this.updateViews();
  }

  public getColumnData(quotationId: string): QuotationDetail[] {
    return this.localStorageService.getFromLocalStorage(
      `${quotationId}_items`
    ) as QuotationDetail[];
  }

  public setColumnData(
    quotationId: string,
    columnData: QuotationDetail[]
  ): void {
    this.localStorageService.setToLocalStorage(
      `${quotationId}_items`,
      columnData.map((detail: QuotationDetail) => ({
        gqPositionId: detail.gqPositionId,
        quotationItemId: detail.quotationItemId,
      }))
    );
  }

  public getColumnFiltersForCurrentView(): FilterState[] {
    return this.getColumnFilters(this.activeTableKey, this.activeViewId);
  }

  public setColumnFilterForCurrentView(
    actionItemId: string,
    filterModels: { [key: string]: any }
  ) {
    this.setColumnFilters(
      this.activeTableKey,
      this.activeViewId,
      actionItemId,
      filterModels
    );
  }

  public getColumnStateForCurrentView() {
    return this.getColumnState(this.activeTableKey, this.activeViewId);
  }

  public setColumnStateForCurrentView(columnState: ColumnState[]) {
    this.setColumnState(this.activeTableKey, this.activeViewId, columnState);
  }

  public setActiveView(customViewId: number) {
    this.activeViewId = customViewId;
    this.updateColumnState();
    this.updateViews();
    this.updateFilterState();
  }

  public getCustomViews(): ViewToggle[] {
    const gridState = this.gridLocalStorageService.getGridState(
      this.activeTableKey
    );
    const views = gridState?.customViews?.map((view: CustomView) => ({
      id: view.id,
      active: false,
      title: view.title,
    }));

    return views || [];
  }

  public getCurrentViewId(): number {
    return this.activeViewId;
  }
  public createViewFromScratch(title: string) {
    this.createNewView(title, []);
  }

  public createViewFromCurrentView(title: string, actionItemId: string) {
    const currentView = this.gridLocalStorageService.getViewById(
      this.activeTableKey,
      this.activeViewId
    );
    this.createNewView(title, currentView.state.columnState, actionItemId);
  }

  public deleteView(id: number) {
    const gridState = this.gridLocalStorageService.getGridState(
      this.activeTableKey
    );

    this.saveGridState({
      ...gridState,
      customViews: gridState.customViews.filter(
        (customView: CustomView) => customView.id !== id
      ),
    });

    this.setActiveView(this.DEFAULT_VIEW_ID);
  }

  public getViewNameById(viewId: number) {
    const gridState = this.gridLocalStorageService.getGridState(
      this.activeTableKey
    );

    return gridState.customViews.find((view) => view.id === viewId).title;
  }

  public updateViewName(viewId: number, name: string) {
    const gridState = this.gridLocalStorageService.getGridState(
      this.activeTableKey
    );

    this.saveGridState({
      ...gridState,
      customViews: gridState.customViews.map((customView: CustomView) => {
        if (customView.id === viewId) {
          return { ...customView, title: name };
        }

        return customView;
      }),
    });
  }

  /**
   * resets any filter for default view
   *
   * @param actionItemId name of the criteria to filter (gqId / activeTab etc)
   */
  public resetFilterModelsOfDefaultView(actionItemId: string): void {
    this.setColumnFilters(
      this.activeTableKey,
      this.DEFAULT_VIEW_ID,
      actionItemId,
      {}
    );
  }

  /**
   * a value inside localStorage changed, so it needs to be renamed
   * @deprecated can be removed a while, when all users have updated their localStorage once, or localStorage is not used any longer
   */
  public renameQuotationIdToActionItemForProcessCaseState(): void {
    this.gridLocalStorageService.renameQuotationIdToActionItemForProcessCaseState();
  }

  public clearDefaultViewColumnAndFilterState() {
    const gridState = this.gridLocalStorageService.getGridState(
      this.activeTableKey
    );
    if (gridState) {
      this.saveGridState({
        ...gridState,
        customViews: gridState.customViews.map((view: CustomView) =>
          view.id === this.DEFAULT_VIEW_ID
            ? {
                ...view,
                state: {
                  columnState: [],
                  filterState: [],
                },
              }
            : view
        ),
      });
    }
  }
  private setColumnState(
    key: string,
    viewId: number,
    columnState: ColumnState[]
  ): void {
    const gridState = this.gridLocalStorageService.getGridState(key);

    this.saveGridState({
      ...gridState,
      customViews: gridState.customViews.map((view: CustomView) =>
        view.id === viewId
          ? {
              ...view,
              state: {
                ...view.state,
                columnState,
              },
            }
          : view
      ),
    });
  }

  private createNewView(
    title: string,
    columnState: ColumnState[],
    actionItemId?: string
  ) {
    const gridState = this.gridLocalStorageService.getGridState(
      this.activeTableKey
    );
    const filterState = this.getColumnFilters(
      this.activeTableKey,
      this.activeViewId
    ).find((state: FilterState) => state.actionItemId === actionItemId);
    const id = this.generateViewId();

    this.saveGridState({
      ...gridState,
      customViews: [
        ...gridState.customViews,
        {
          id,
          title,
          state: {
            columnState,
            filterState: filterState ? [filterState] : [],
          },
        },
      ],
    });

    this.activeViewId = id;
    this.updateViews();
    this.updateFilterState();
    this.updateColumnState();
  }

  private generateViewId(): number {
    const ids: number[] = this.getCustomViews().map(
      (view: ViewToggle) => view.id
    );
    ids.sort((a: number, b: number) => a - b);

    return ids.at(-1) + 1;
  }

  private saveGridState(gridState: GridState) {
    const currentCustomView = this.getCustomViewOfActiveView(
      gridState,
      this.activeViewId
    );

    const storedCustomView = this.gridLocalStorageService.getViewById(
      this.activeTableKey,
      this.activeViewId
    );

    const oldColumnState = storedCustomView?.state?.columnState ?? [];
    const newColumnState = currentCustomView?.state.columnState ?? [];

    if (
      oldColumnState.length > 0 &&
      !this.containSameColIds(oldColumnState, newColumnState) &&
      newColumnState.length > 0 &&
      this.activeViewId !== this.DEFAULT_VIEW_ID &&
      this.columnIds?.length > 0
    ) {
      const updatedColumnState = this.gridMergeService.mergeAndReorderColumns(
        oldColumnState,
        newColumnState
      );
      currentCustomView.state.columnState = updatedColumnState;
      gridState.initialColIds = updatedColumnState.map((col) => col.colId);
    }

    this.gridLocalStorageService.setGridState(this.activeTableKey, gridState);
    this.updateViews();
    this.updateColumnState();
    this.updateFilterState();
  }

  private getCustomViewOfActiveView(
    gridState: GridState,
    activeViewId: number
  ) {
    return gridState.customViews.find((item) => item.id === activeViewId);
  }

  private containSameColIds(
    oldColumnState: ColumnState[],
    newColumnState: ColumnState[]
  ) {
    // extract the colId values from each ColumnState in the arrays
    const oldColIds = oldColumnState.map((columnState) => columnState.colId);
    const newColIds = newColumnState.map((columnState) => columnState.colId);

    const sortedOldColIds = oldColIds.sort();
    const sortedNewColIds = newColIds.sort();

    return JSON.stringify(sortedOldColIds) === JSON.stringify(sortedNewColIds);
  }

  private updateViews() {
    const views = this.getCustomViews();
    this.views.next(
      views?.map((view: ViewToggle) => {
        if (view.id === this.activeViewId) {
          return { ...view, active: true };
        }

        return { ...view, active: false };
      }) || []
    );
  }

  private updateColumnState() {
    const columnState = this.getColumnStateForCurrentView();
    this.columnState.next(columnState);
  }

  private updateFilterState() {
    const filterState = this.getColumnFiltersForCurrentView();
    this.filterState.next(filterState);
  }
  private setColumnFilters(
    key: string,
    viewId: number,
    actionItemId: string,
    filterModels: { [key: string]: any }
  ): void {
    const existingFilters = this.getColumnFilters(key, viewId);
    const gridState = this.gridLocalStorageService.getGridState(key);

    const filterState: FilterState[] =
      existingFilters !== undefined &&
      existingFilters.findIndex(
        (filter: FilterState) => filter.actionItemId === actionItemId
      ) > -1
        ? existingFilters.map((curFilterState: FilterState) => {
            if (curFilterState.actionItemId === actionItemId) {
              return { actionItemId, filterModels };
            }

            return curFilterState;
          })
        : [
            ...existingFilters,
            {
              actionItemId,
              filterModels,
            },
          ];

    this.saveGridState({
      ...gridState,
      customViews: gridState.customViews.map((view: CustomView) =>
        view.id === viewId
          ? {
              ...view,
              state: {
                ...view.state,
                filterState,
              },
            }
          : view
      ),
    });
  }

  private getColumnFilters(key: string, viewId: number) {
    const view = this.gridLocalStorageService.getViewById(key, viewId);

    return view?.state?.filterState || [];
  }

  private getColumnState(key: string, viewId: number) {
    const view = this.gridLocalStorageService.getViewById(key, viewId);

    return view?.state?.columnState || [];
  }

  private cleanupRemovedColumns(gridState: GridState) {
    if (
      this.gridMergeService.getUpdateCustomViewsWhenConfiguredColumnsRemoved(
        gridState,
        this.DEFAULT_VIEW_ID,
        this.columnIds
      )
    ) {
      this.saveGridState({
        ...gridState,
        initialColIds: this.columnIds,
      });
    }
  }
}
