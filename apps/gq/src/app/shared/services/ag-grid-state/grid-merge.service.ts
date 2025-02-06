import { Injectable } from '@angular/core';

import { CustomView, GridState } from '@gq/shared/models/grid-state.model';
import { ColumnState } from 'ag-grid-enterprise';
import { differenceBy } from 'lodash';

const userEvents = new Set([
  'uiColumnMoved',
  'uiColumnSorted',
  'uiColumnResized',
  'toolPanelUi',
  'columnMenu',
]);
@Injectable({
  providedIn: 'root',
})
export class GridMergeService {
  mergeAndReorderColumns(
    oldColumnState: ColumnState[],
    newColumnState: ColumnState[],
    defaultOrderColIds: string[],
    eventSource: string = null
  ): ColumnState[] {
    // create a map for quick access to old columns and to check for new columns
    const oldMap: Record<string, ColumnState> = {};
    oldColumnState.forEach((column) => {
      oldMap[column.colId] = column;
    });

    const newMap: Record<string, ColumnState> = {};
    newColumnState.forEach((column) => {
      newMap[column.colId] = column;
    });

    const result: ColumnState[] = [];
    // when user event has been triggered. the NewColumnState should be used as the base especially for column order, width etc.
    // but still columnDefinition of stored State and NewState must be merged together
    if (userEvents.has(eventSource)) {
      // userEvents handling
      newColumnState.forEach((column) => {
        if (newMap[column.colId] || defaultOrderColIds.includes(column.colId)) {
          result.push(column);
        }
      });

      // iterate through old columnState and add columns that are not present in newColumnState but keep the config
      oldColumnState.forEach((newCol) => {
        if (!newMap[newCol.colId]) {
          const insertIndex = this.findInsertIndex(
            oldColumnState.map((col) => col.colId),
            newCol.colId,
            result
          );

          result.splice(insertIndex, 0, { ...newCol });
        }
      });

      return result;
    }

    // add elements from oldColumnState that should be kept (i.e., present in newColumnState)
    oldColumnState.forEach((column) => {
      if (newMap[column.colId] || defaultOrderColIds.includes(column.colId)) {
        result.push(column);
      }
    });

    // process newColumnState and add the new column id next to the first neighbor that has been found
    newColumnState.forEach((newCol) => {
      if (!oldMap[newCol.colId]) {
        const insertIndex = this.findInsertIndex(
          defaultOrderColIds,
          newCol.colId,
          result
        );
        result.splice(insertIndex, 0, { ...newCol, hide: true }); // new columns should be hidden by default
      }
    });

    return result;
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

  private findInsertIndex(
    defaultOrderColIds: string[],
    colId: string,
    result: ColumnState[]
  ): number {
    const oldColIdsSet = new Set(result.map((col) => col.colId));
    // get the index of the new column in the default order
    const defaultIndex = defaultOrderColIds.indexOf(colId);

    // look to the left for a neighbor in the old column set
    for (let i = defaultIndex - 1; i >= 0; i = i - 1) {
      if (oldColIdsSet.has(defaultOrderColIds[i])) {
        return (
          result.findIndex((col) => col.colId === defaultOrderColIds[i]) + 1
        );
      }
    }

    // look to the right for a neighbor in the old column set
    for (let i = defaultIndex + 1; i < defaultOrderColIds.length; i = i + 1) {
      if (oldColIdsSet.has(defaultOrderColIds[i])) {
        return result.findIndex((col) => col.colId === defaultOrderColIds[i]);
      }
    }

    // ff no neighbors found, default to 0
    return 0;
  }
}
