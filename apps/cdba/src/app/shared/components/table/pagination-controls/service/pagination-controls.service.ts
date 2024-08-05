import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';

import {
  MIN_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  USER_PAGE_SIZE_KEY,
} from '@cdba/shared/constants/pagination';

@Injectable({ providedIn: 'root' })
export class PaginationControlsService {
  constructor(@Inject(LOCAL_STORAGE) private readonly localStorage: Storage) {}

  getPageSizeFromLocalStorage(): number {
    const localStoragePageSize = Number(
      this.localStorage.getItem(USER_PAGE_SIZE_KEY)
    );

    if (
      localStoragePageSize !== undefined &&
      PAGE_SIZE_OPTIONS.includes(localStoragePageSize)
    ) {
      return localStoragePageSize;
    } else {
      this.localStorage.setItem(USER_PAGE_SIZE_KEY, String(MIN_PAGE_SIZE));

      return MIN_PAGE_SIZE;
    }
  }

  setPageSizeToLocalStorage(newPageSize: number): void {
    // Ignore values not from available options
    if (PAGE_SIZE_OPTIONS.includes(newPageSize)) {
      this.localStorage.setItem(USER_PAGE_SIZE_KEY, String(newPageSize));
    }
  }
}
