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
} from '../../../shared/models/grid-state.model';
import { QuotationDetail } from '../../models/quotation-detail';

@Injectable({
  providedIn: 'root',
})
export class AgGridStateService {
  DEFAULT_VIEW_ID = 0;

  private activeTableKey: string;
  private activeViewId = this.DEFAULT_VIEW_ID;

  views: BehaviorSubject<ViewToggle[]> = new BehaviorSubject<ViewToggle[]>([]);
  columnState: BehaviorSubject<ColumnState[]> = new BehaviorSubject<
    ColumnState[]
  >([]);
  filterState: BehaviorSubject<FilterState[]> = new BehaviorSubject<
    FilterState[]
  >([]);

  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  public init(tableName: string) {
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

  private getColumnFilters(key: string, viewId: number) {
    const view = this.getViewById(key, viewId);

    return view?.state?.filterState || [];
  }

  public getColumnFiltersForCurrentView(): FilterState[] {
    return this.getColumnFilters(this.activeTableKey, this.activeViewId);
  }

  private setColumnFilters(
    key: string,
    viewId: number,
    quotationId: string,
    filterModels: { [key: string]: any }
  ): void {
    const existingFilters = this.getColumnFilters(key, viewId);
    const gridState = this.getGridState(key);

    const filterState: FilterState[] =
      existingFilters !== undefined &&
      existingFilters.findIndex(
        (filter: FilterState) => filter.quotationId === quotationId
      ) > -1
        ? [
            ...existingFilters.map((curFilterState: FilterState) => {
              if (curFilterState.quotationId === quotationId) {
                return { quotationId, filterModels };
              }

              return curFilterState;
            }),
          ]
        : [
            ...existingFilters,
            {
              quotationId,
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

  public setColumnFilterForCurrentView(
    quotationId: string,
    filterModels: { [key: string]: any }
  ) {
    this.setColumnFilters(
      this.activeTableKey,
      this.activeViewId,
      quotationId,
      filterModels
    );
  }

  private getColumnState(key: string, viewId: number) {
    const view = this.getViewById(key, viewId);

    return view?.state?.columnState || [];
  }

  public getColumnStateForCurrentView() {
    return this.getColumnState(this.activeTableKey, this.activeViewId);
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

  public setColumnStateForCurrentView(columnState: ColumnState[]) {
    this.setColumnState(this.activeTableKey, this.activeViewId, columnState);
  }

  public setActiveView(customViewId: number) {
    this.activeViewId = customViewId;
    this.udpateColumnState();
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
    quotationId?: string
  ) {
    const gridState = this.getGridState(this.activeTableKey);
    const filterState = this.getColumnFilters(
      this.activeTableKey,
      this.activeViewId
    ).find((state: FilterState) => state.quotationId === quotationId);
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
    this.udpateColumnState();
  }

  public createViewFromScratch(title: string) {
    this.createNewView(title, []);
  }

  public createViewFromCurrentView(title: string, quotationId: string) {
    const currentView = this.getCurrentView();
    this.createNewView(title, currentView.state.columnState, quotationId);
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
   * @param quotationId number of quotation to reset the filterModel
   */
  public resetFilterModelsOfDefaultView(quotationId: string): void {
    this.setColumnFilters(
      this.activeTableKey,
      this.DEFAULT_VIEW_ID,
      quotationId,
      {}
    );
  }

  private saveGridState(gridState: GridState) {
    this.localStorage.setItem(this.activeTableKey, JSON.stringify(gridState));
    this.updateViews();
    this.udpateColumnState();
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

  private udpateColumnState() {
    const columnState = this.getColumnStateForCurrentView();
    this.columnState.next(columnState);
  }

  private updateFilterState() {
    const filterState = this.getColumnFiltersForCurrentView();
    this.filterState.next(filterState);
  }
}
