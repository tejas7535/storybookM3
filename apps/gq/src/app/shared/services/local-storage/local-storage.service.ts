import { inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly localStorage: Storage = inject(LOCAL_STORAGE);

  /**
   * get Object from LocalStorage by Key
   *
   * @param key key of localStorageProperty
   * @returns the parsed object
   */
  getFromLocalStorage(key: string): any {
    return JSON.parse(this.localStorage.getItem(key));
  }

  /**
   *
   * @param key the key to set in localStorage
   * @param data the dataObject (non-stringified) to save
   */
  setToLocalStorage(key: string, data: any) {
    this.localStorage.setItem(key, JSON.stringify(data));
  }
}
