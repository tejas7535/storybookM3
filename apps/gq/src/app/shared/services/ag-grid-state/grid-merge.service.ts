import { Injectable } from '@angular/core';

import { CustomView, GridState } from '@gq/shared/models/grid-state.model';
import { ColumnState } from 'ag-grid-community';
import { differenceBy } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class GridMergeService {
  mergeAndReorderColumns(
    oldColumnState: ColumnState[],
    newColumnState: ColumnState[]
  ): ColumnState[] {
    // Create a map of column states from the old array by their colId
    const oldMap: Record<string, ColumnState> = {};
    oldColumnState.forEach((column) => {
      oldMap[column.colId] = column;
    });

    const matched: ColumnState[] = [];
    const unmatched: ColumnState[] = [];

    // Process the new array
    newColumnState.forEach((column) => {
      if (Object.prototype.hasOwnProperty.call(oldMap, column.colId)) {
        // Use the settings from the old array
        matched.push(oldMap[column.colId]);
      } else {
        unmatched.push({ ...column, hide: true }); // hide new columns to prevent them from appearing in custom user views automatically
      }
    });

    // Sort the matched based on the order in the old array
    matched.sort(
      (a, b) =>
        oldColumnState.findIndex((x) => x.colId === a.colId) -
        oldColumnState.findIndex((x) => x.colId === b.colId)
    );

    // Reconstruct the array
    const result: ColumnState[] = [];
    let matchedIndex = 0;
    let unmatchedIndex = 0;

    newColumnState.forEach((column) => {
      if (Object.prototype.hasOwnProperty.call(oldMap, column.colId)) {
        result.push(matched[matchedIndex]);
        matchedIndex += 1;
      } else {
        result.push(unmatched[unmatchedIndex]);
        unmatchedIndex += 1;
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
}
