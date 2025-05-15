import { Injectable } from '@angular/core';

import {
  MIN_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  USER_PAGE_SIZE_KEY,
} from '@cdba/shared/constants/pagination';
import { LocalStorageService } from '@cdba/shared/services';

@Injectable({ providedIn: 'root' })
export class PaginationControlsService {
  constructor(private readonly localStorageService: LocalStorageService) {}

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
