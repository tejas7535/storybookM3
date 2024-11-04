import { Injectable } from '@angular/core';

import { CustomView, GridState } from '@gq/shared/models/grid-state.model';
import { ColumnState } from 'ag-grid-community';
import { differenceBy } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class GridMergeService {
  /**
   * merges the differences between App configured ColumnDefinitions and ColumnState in LocalStorage
   * @param gridState the gridState to get updated
   * @param activeViewId id of the activeView
   * @param columnIds configuredColumnDefinitions
   * @param currentViewLocalStorage currentViewState within LocalStorage
   */
  handleAdjustments(
    gridState: GridState,
    activeViewId: number,
    columnIds: string[],
    currentViewLocalStorage: CustomView
  ) {
    if (
      this.checkForAdjustmentsNeeded(
        gridState,
        activeViewId,
        currentViewLocalStorage
      )
    ) {
      // UseCase 1 - Column is in LocalStorage but not in UserView (Column is "reshown" in UserView)
      this.handleColumnsFromLocalStorage(
        gridState,
        activeViewId,
        currentViewLocalStorage
      );
      // UseCase 2 - Column is in UserView but not in LocalStorage (Column is hidden in UserView)
      this.handleColumnsFromUserGrid(
        gridState,
        activeViewId,
        columnIds,
        currentViewLocalStorage
      );

      if (gridState.initialColIds && columnIds) {
        gridState.initialColIds = columnIds;
      }
    }
  }

  /**
   * removes columns from customViews when they are removed from configuredColumns
   *
   * @param gridState the gridState to get updated
   * @param defaultViewId id of the DefaultView
   * @param configuredColumnsIds the configuredColumnDefinitions
   * @returns true if ColumnDefinitions in app NOT equal those in localStorage, false if equal
   */
  getUpdateCustomViewsWhenConfiguredColumnsRemoved(
    gridState: GridState,
    defaultViewId: number,
    configuredColumnsIds: string[]
  ): boolean {
    const colsToCleanUp = differenceBy(
      gridState.initialColIds,
      configuredColumnsIds
    );
    gridState.customViews
      .filter((view) => view.id !== defaultViewId)
      .forEach((view: CustomView) => {
        colsToCleanUp.forEach((colId: string) => {
          const foundIndex = view.state.columnState.findIndex(
            (col: ColumnState) => col.colId === colId
          );
          if (foundIndex > -1) {
            view.state.columnState.splice(foundIndex, 1);
          }
        });
      });

    return colsToCleanUp.length > 0;
  }

  private checkForAdjustmentsNeeded(
    gridState: GridState,
    activeViewId: number,
    currentViewLocalStorage: CustomView
  ): boolean {
    const colToAdd =
      this.getColumnsInUserGridButNotInLocalStorage(
        gridState,
        activeViewId,
        currentViewLocalStorage
      )?.length > 0;
    const colsToUnhide =
      this.getColumnsInLocalStorageButNotInUserGrid(
        gridState,
        activeViewId,
        currentViewLocalStorage
      )?.length > 0;

    return colToAdd || colsToUnhide;
  }

  private handleColumnsFromLocalStorage(
    gridState: GridState,
    activeViewId: number,
    currentViewLocalStorage: CustomView
  ) {
    const columnStatesInLocalStorageButNotInViewInApp =
      this.getColumnsInLocalStorageButNotInUserGrid(
        gridState,
        activeViewId,
        currentViewLocalStorage
      );

    this.addLocalStorageColumnToUserGridAtIndex(
      columnStatesInLocalStorageButNotInViewInApp,
      gridState,
      activeViewId,
      currentViewLocalStorage
    );
  }

  private handleColumnsFromUserGrid(
    gridState: GridState,
    activeViewId: number,
    columnIds: string[],
    currentViewLocalStorage: CustomView
  ) {
    this.moveColumnNotInLocalStorageToIndexConfigured(
      this.getColumnsInUserGridButNotInLocalStorage(
        gridState,
        activeViewId,
        currentViewLocalStorage
      ),
      gridState,
      activeViewId,
      columnIds
    );
  }

  private moveColumnNotInLocalStorageToIndexConfigured(
    columnStatesInGridButNotInLocalStorage: ColumnState[],
    gridState: GridState,
    activeViewId: number,
    columnIds: string[]
  ) {
    // when a column is added to the Grid, default behavior is to Place it at the end
    // with this method it will be placed at the  index of current AppGrid Index

    const userCurrentView = gridState.customViews.find(
      (item) => item.id === activeViewId
    );
    columnStatesInGridButNotInLocalStorage.forEach((colDef) => {
      // hide new columns, this is for a customView, it has been configured like this
      colDef.hide = true;
      const recentIndex = userCurrentView.state.columnState.findIndex(
        (item) => item.colId === colDef.colId
      );
      const newIndex = columnIds.indexOf(colDef.colId);
      const indexNeighborConsidered =
        this.getNextLowerNeighborIndexWithinConfiguredColumns(
          newIndex,
          columnIds,
          userCurrentView
        );

      if (recentIndex > -1 && newIndex > -1 && indexNeighborConsidered > -1) {
        userCurrentView.state.columnState.splice(
          indexNeighborConsidered,
          0,
          userCurrentView.state.columnState.splice(recentIndex, 1)[0]
        );
      }
    });
  }

  private getNextLowerNeighborIndexWithinConfiguredColumns(
    newIndex: number,
    columnIds: string[],
    userCurrentView: CustomView
  ): number {
    if (newIndex <= 0) {
      return newIndex;
    }

    // the newIndex ist based on the columnIds
    // when one or multiple columns have been filtered out (e.g. lack of access) the newIndex does not match any longer.
    // the column shall be placed right to the next possible left neighbor based on order within the configured columns
    const neighborColId = columnIds[newIndex - 1];
    // check if neighborColId is in GridView
    const neighborIndex = columnIds.indexOf(neighborColId);

    if (neighborIndex > -1) {
      // find the index of neighborColumn in GridView
      const neighborIndexInUserView =
        userCurrentView.state.columnState.findIndex(
          (item) => item.colId === neighborColId
        );
      if (neighborIndexInUserView > -1) {
        // when neighborColumn is in Grid the newIndex of the Column to add is the neighborIndex + 1
        return neighborIndexInUserView + 1;
      }
    }

    // the next left neighbor is not in the Grid, check the next left neighbor ("2nd left neighbor") until a neighbor is found
    return this.getNextLowerNeighborIndexWithinConfiguredColumns(
      newIndex - 1,
      columnIds,
      userCurrentView
    );
  }

  private addLocalStorageColumnToUserGridAtIndex(
    columnStatesInLocalStorageButNotInViewInApp: ColumnState[],
    gridState: GridState,
    activeViewId: number,
    currentViewLocalStorage: CustomView
  ) {
    columnStatesInLocalStorageButNotInViewInApp.forEach((colDef) => {
      // Each Def will added with it's config
      // 1. findIndex in LocalStorage
      const placeAt = currentViewLocalStorage.state.columnState.findIndex(
        (item) => item.colId === colDef.colId
      );
      // 2. Add it to the UserView on Position if found
      if (placeAt > -1) {
        gridState.customViews
          .find((item) => item.id === activeViewId)
          .state.columnState.splice(placeAt, 0, colDef);
      }
    });
  }

  private getColumnsInUserGridButNotInLocalStorage(
    gridState: GridState,
    activeViewId: number,
    currentViewLocalStorage: CustomView
  ) {
    const userCurrentView = this.getCustomViewOfActiveView(
      gridState,
      activeViewId
    );
    const columnStatesInAppButNotInLocalStorage = differenceBy(
      userCurrentView.state.columnState,
      currentViewLocalStorage.state.columnState,
      'colId'
    );

    return columnStatesInAppButNotInLocalStorage;
  }

  private getColumnsInLocalStorageButNotInUserGrid(
    gridState: GridState,
    activeViewId: number,
    currentViewLocalStorage: CustomView
  ) {
    const userCurrentView = this.getCustomViewOfActiveView(
      gridState,
      activeViewId
    );

    const columnStatesInLocalStorageButNotInViewInApp = differenceBy(
      currentViewLocalStorage.state.columnState,
      userCurrentView.state.columnState,
      'colId'
    );

    return columnStatesInLocalStorageButNotInViewInApp;
  }

  private getCustomViewOfActiveView(
    gridState: GridState,
    activeViewId: number
  ) {
    const userCurrentView = gridState.customViews.find(
      (item) => item.id === activeViewId
    );

    return userCurrentView;
  }
}
