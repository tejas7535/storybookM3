import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  setPaginationEnabled,
  setPaginationVisible,
  updatePaginationState,
} from '@cdba/core/store';
import { PaginationState } from '@cdba/core/store/reducers/search/search.reducer';
import {
  MIN_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  USER_PAGE_SIZE_KEY,
} from '@cdba/shared/constants/pagination';
import { LocalStorageService } from '@cdba/shared/services';

@Injectable({ providedIn: 'root' })
export class PaginationControlsService {
  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly store: Store
  ) {}

  setupInitialPaginationState(totalRange: number): void {
    const pageSize = this.getPageSizeFromLocalStorage();

    const indexes = this.calculateRangeIndexes(0, pageSize, totalRange);

    this.store.dispatch(
      updatePaginationState({
        paginationState: {
          isVisible: true,
          isEnabled: totalRange > MIN_PAGE_SIZE,
          currentPage: 0,
          pageSize,
          totalPages: Math.ceil(totalRange / pageSize),
          totalRange,
          currentRangeStartIndex: indexes.currentRangeStartIndex,
          currentRangeEndIndex: indexes.currentRangeEndIndex,
        } as PaginationState,
      })
    );
  }

  setVisible(isVisible: boolean): void {
    this.store.dispatch(
      setPaginationVisible({
        isVisible,
      })
    );
  }

  disablePagination(): void {
    this.store.dispatch(
      setPaginationEnabled({
        isEnabled: false,
      })
    );
  }

  calculateRangeIndexes(
    currentPage: number,
    pageSize: number,
    totalRange: number
  ): { currentRangeStartIndex: number; currentRangeEndIndex: number } {
    if (totalRange <= pageSize) {
      return { currentRangeStartIndex: 1, currentRangeEndIndex: totalRange };
    } else if (currentPage === 0) {
      return { currentRangeStartIndex: 1, currentRangeEndIndex: pageSize };
    } else {
      const currRangeStartIndexTmp = currentPage * pageSize + 1;

      return {
        currentRangeStartIndex: currentPage * pageSize + 1,
        currentRangeEndIndex: Math.min(
          currRangeStartIndexTmp + pageSize,
          totalRange
        ),
      };
    }
  }

  getPageSizeFromLocalStorage(): number {
    const localStoragePageSize = this.localStorageService.getItem<number>(
      USER_PAGE_SIZE_KEY,
      false
    );
    if (
      localStoragePageSize !== undefined &&
      PAGE_SIZE_OPTIONS.includes(localStoragePageSize)
    ) {
      return localStoragePageSize;
    } else {
      this.localStorageService.setItem<number>(
        USER_PAGE_SIZE_KEY,
        MIN_PAGE_SIZE,
        false
      );

      return MIN_PAGE_SIZE;
    }
  }

  setPageSizeToLocalStorage(newPageSize: number): void {
    // Ignore values not from available options
    if (PAGE_SIZE_OPTIONS.includes(newPageSize)) {
      this.localStorageService.setItem<number>(
        USER_PAGE_SIZE_KEY,
        newPageSize,
        false
      );
    }
  }
}
