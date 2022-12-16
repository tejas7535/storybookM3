import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { ColumnState } from 'ag-grid-enterprise';

import { ViewToggle } from '@schaeffler/view-toggle';

import { CustomView, GridState } from '../../../shared/models/grid-state.model';
import { QuotationDetail } from '../../models/quotation-detail';

@Injectable({
  providedIn: 'root',
})
export class AgGridStateService {
  private activeTableKey: string;
  private activeViewId = 0;

  columnState: BehaviorSubject<ColumnState[]> = new BehaviorSubject<
    ColumnState[]
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
            { id: 0, title: 'default', state: { columnState: [] } },
          ],
        } as GridState)
      );
    }
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

  public getColumnFilters(quotationId: string) {
    return JSON.parse(this.localStorage.getItem(`${quotationId}_filterModels`));
  }

  public setColumnFilters(
    quotationId: string,
    filterModels: { [key: string]: any }
  ): void {
    this.localStorage.setItem(
      `${quotationId}_filterModels`,
      JSON.stringify(filterModels)
    );
  }

  private getColumnState(key: string, viewId: number): ColumnState[] {
    const view = this.getViewById(key, viewId);

    return view?.state?.columnState || [];
  }

  public getColumnStateForCurrentView(): ColumnState[] {
    return this.getColumnState(this.activeTableKey, this.activeViewId);
  }

  private setColumnState(
    key: string,
    viewId: number,
    columnState: ColumnState[]
  ): void {
    const gridState = this.getGridState(key);

    this.localStorage.setItem(
      key,
      JSON.stringify({
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
      })
    );
  }

  public setColumnStateForCurrentView(columnState: ColumnState[]) {
    this.setColumnState(this.activeTableKey, this.activeViewId, columnState);
  }

  public setActiveView(customViewId: number) {
    this.activeViewId = customViewId;

    const columnState = this.getColumnStateForCurrentView();
    this.columnState.next(columnState);
  }

  public getCustomViews(): ViewToggle[] {
    const gridState = this.getGridState(this.activeTableKey);
    const views = gridState?.customViews?.map((view: CustomView) => ({
      id: view.id,
      title: view.title,
    }));

    return views || [];
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
}
