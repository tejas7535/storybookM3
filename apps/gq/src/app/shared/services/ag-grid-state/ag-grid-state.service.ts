/* eslint-disable max-lines */
import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { translate } from '@ngneat/transloco';
import { ColumnState } from 'ag-grid-enterprise';

import { ViewToggle } from '@schaeffler/view-toggle';

import {
  CustomView,
  FilterState,
  GridState,
} from '../../models/grid-state.model';
import { QuotationDetail } from '../../models/quotation-detail';

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

  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  /**
   * Init the gridState by table key.
   * Optionally customViews can be passed initially, which will be added to the default view.
   * When table key is not present in localStorage, it will be created.
   *
   * @param tableName key of the table
   * @param additionalViews all custom views but the default one
   */
  public init(tableName: string, additionalViews?: CustomView[]) {
    this.activeTableKey = `GQ_${tableName.toUpperCase()}_STATE`;

    if (!this.localStorage.getItem(this.activeTableKey)) {
      this.localStorage.setItem(
        this.activeTableKey,
        JSON.stringify({
          version: 1,
          customViews: [
            {
              id: 0,
              title: translate('shared.quotationDetailsTable.defaultView'),
              state: { columnState: [] },
            },
            ...(additionalViews || []),
          ],
        } as GridState)
      );
    }

    this.updateViews();
  }

  public getColumnData(quotationId: string): QuotationDetail[] {
    return JSON.parse(this.localStorage.getItem(`${quotationId}_items`));
  }

  public setColumnData(
    quotationId: string,
    columnData: QuotationDetail[]
  ): void {
    this.localStorage.setItem(
      `${quotationId}_items`,
      JSON.stringify(
        columnData.map((detail: QuotationDetail) => ({
          gqPositionId: detail.gqPositionId,
          quotationItemId: detail.quotationItemId,
        }))
      )
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
    const gridState = this.getGridState(this.activeTableKey);
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
    const currentView = this.getCurrentView();
    this.createNewView(title, currentView.state.columnState, actionItemId);
  }

  public deleteView(id: number) {
    const gridState = this.getGridState(this.activeTableKey);

    this.saveGridState({
      ...gridState,
      customViews: [
        ...gridState.customViews.filter(
          (customView: CustomView) => customView.id !== id
        ),
      ],
    });

    this.setActiveView(this.DEFAULT_VIEW_ID);
  }

  public getViewNameById(viewId: number) {
    const gridState = this.getGridState(this.activeTableKey);

    return gridState.customViews.find((view) => view.id === viewId).title;
  }

  public updateViewName(viewId: number, name: string) {
    const gridState = this.getGridState(this.activeTableKey);

    this.saveGridState({
      ...gridState,
      customViews: [
        ...gridState.customViews.map((customView: CustomView) => {
          if (customView.id === viewId) {
            return { ...customView, title: name };
          }

          return customView;
        }),
      ],
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
    let toBeRenamed = false;
    const gridState = this.getGridState(`GQ_PROCESS_CASE_STATE`);
    if (!gridState) {
      return;
    }

    const customViews = gridState?.customViews?.map((view: CustomView) => {
      const filterState = view.state?.filterState?.map(
        (filter: FilterState & { quotationId?: string }) => {
          if (filter.quotationId) {
            // the field quotationId needs to be renamed to actionItemId
            const newFilter: FilterState = {
              actionItemId: filter.quotationId,
              filterModels: filter.filterModels,
            };
            toBeRenamed = true;

            return newFilter;
          } else {
            return filter;
          }
        }
      );

      return {
        ...view,
        state: {
          ...view.state,
          filterState,
        },
      };
    });

    if (toBeRenamed) {
      this.localStorage.setItem(
        `GQ_PROCESS_CASE_STATE`,
        JSON.stringify({
          ...gridState,
          customViews,
        })
      );
    }
  }

  private setColumnState(
    key: string,
    viewId: number,
    columnState: ColumnState[]
  ): void {
    const gridState = this.getGridState(key);

    this.saveGridState({
      ...gridState,
      customViews: [
        ...gridState.customViews.map((view: CustomView) =>
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
      ],
    });
  }

  private getGridState(key: string): GridState {
    return JSON.parse(this.localStorage.getItem(key)) as GridState;
  }

  private getViewById(key: string, viewId: number): CustomView | undefined {
    const gridState = this.getGridState(key);

    return gridState.customViews.find(
      (customView: CustomView) => customView.id === viewId
    );
  }

  private createNewView(
    title: string,
    columnState: ColumnState[],
    actionItemId?: string
  ) {
    const gridState = this.getGridState(this.activeTableKey);
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

    return ids[ids.length - 1] + 1;
  }

  private getCurrentView() {
    const gridState = this.getGridState(this.activeTableKey);

    return gridState.customViews.find(
      (view: CustomView) => view.id === this.activeViewId
    );
  }

  private saveGridState(gridState: GridState) {
    this.localStorage.setItem(this.activeTableKey, JSON.stringify(gridState));
    this.updateViews();
    this.updateColumnState();
    this.updateFilterState();
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
    const gridState = this.getGridState(key);

    const filterState: FilterState[] =
      existingFilters !== undefined &&
      existingFilters.findIndex(
        (filter: FilterState) => filter.actionItemId === actionItemId
      ) > -1
        ? [
            ...existingFilters.map((curFilterState: FilterState) => {
              if (curFilterState.actionItemId === actionItemId) {
                return { actionItemId, filterModels };
              }

              return curFilterState;
            }),
          ]
        : [
            ...existingFilters,
            {
              actionItemId,
              filterModels,
            },
          ];

    this.saveGridState({
      ...gridState,
      customViews: [
        ...gridState.customViews.map((view: CustomView) =>
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
      ],
    });
  }

  private getColumnFilters(key: string, viewId: number) {
    const view = this.getViewById(key, viewId);

    return view?.state?.filterState || [];
  }

  private getColumnState(key: string, viewId: number) {
    const view = this.getViewById(key, viewId);

    return view?.state?.columnState || [];
  }
}
