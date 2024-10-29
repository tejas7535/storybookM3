import { inject, Injectable } from '@angular/core';

import {
  CustomView,
  FilterState,
  GridState,
} from '@gq/shared/models/grid-state.model';
import { translate } from '@jsverse/transloco';

import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class GridLocalStorageService {
  private readonly localStorageService: LocalStorageService =
    inject(LocalStorageService);

  /**
   * get customView State of requestedView
   * @param activeTableKey key of the activeTable in localStorage
   * @param viewId id of requestedView
   * @returns customView of requestedView
   */
  getViewById(activeTableKey: string, viewId: number): CustomView | undefined {
    const gridState = this.getGridState(activeTableKey);

    return gridState.customViews.find(
      (customView: CustomView) => customView.id === viewId
    );
  }

  /**
   * get gridState of activeTable
   * @param activeTableKey key of the activeTable in localStorage
   * @returns the complete localStorage State of the activeTable
   */
  getGridState(activeTableKey: string): GridState {
    return this.localStorageService.getFromLocalStorage(
      activeTableKey
    ) as GridState;
  }

  /**
   * set gridState of activeTable
   * @param activeTableKey key of the activeTable in localStorage
   * @param gridState the gridState to be saved
   */
  setGridState(activeTableKey: string, gridState: GridState): void {
    this.localStorageService.setToLocalStorage(activeTableKey, gridState);
  }

  /**
   * create the initialStorage entry for given Key
   * @param activeTableKey key of the activeTable in LocalStorage
   * @param additionalViews list of additionalViews to be added to the initial state
   * @param columnIds columnIds of the app configured ColumnDefinitions
   */
  createInitialLocalStorage(
    activeTableKey: string,
    additionalViews: CustomView[],
    columnIds: string[]
  ) {
    this.setGridState(activeTableKey, {
      version: 1,
      customViews: [
        {
          id: 0,
          title: translate('shared.quotationDetailsTable.defaultView'),
          state: { columnState: [] },
        },
        ...(additionalViews || []),
      ],
      initialColIds: columnIds,
    } as GridState);
  }

  /**
   * a value inside localStorage changed, so it needs to be renamed
   * @deprecated can be removed a while, when all users have updated their localStorage once, or localStorage is not used any longer
   */
  renameQuotationIdToActionItemForProcessCaseState(): void {
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
      this.localStorageService.setToLocalStorage(`GQ_PROCESS_CASE_STATE`, {
        ...gridState,
        customViews,
      });
    }
  }
}
