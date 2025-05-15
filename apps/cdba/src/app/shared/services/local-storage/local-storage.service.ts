import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  /**
   * Gets item from localStorage. Use parse = true when parsing objects.
   *
   * @param key lookup key
   * @param parse set to true if the item should be parsed with JSON.parse, false otherwise
   * @returns object of type T or undefined if not found
   * @throws error if parsing fails
   */
  getItem<T>(key: string, parse: boolean): T {
    const item = this.localStorage.getItem(key);

    if (item) {
      if (!parse) {
        return item as T;
      }
      try {
        return JSON.parse(item) as T;
      } catch (error) {
        this.localStorage.removeItem(key);

        throw new Error(
          `Error parsing item for key: ${key} from localStorage: ${error}`
        );
      }
    }

    return undefined;
  }

  /**
   * Sets item in localStorage.
   *
   * @param key set key
   * @param value value to be stored
   * @param parse set to true if the item should be parsed with JSON.stringify, false otherwise
   */
  setItem<T>(key: string, value: T, parse: boolean): void {
    if (value !== undefined) {
      this.localStorage.setItem(
        key,
        parse ? JSON.stringify(value) : (value as string)
      );
    }
  }

  /**
   * Removes all items from localStorage.
   */
  clear(): void {
    this.localStorage.clear();
  }
}
