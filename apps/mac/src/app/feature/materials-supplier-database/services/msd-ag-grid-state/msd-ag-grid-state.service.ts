import { Inject, Injectable } from '@angular/core';

import { ColumnState } from '@ag-grid-enterprise/all-modules';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

@Injectable({
  providedIn: 'root',
})
export class MsdAgGridStateService {
  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  public getColumnState(key: string): ColumnState[] {
    return JSON.parse(this.localStorage.getItem(key));
  }

  public setColumnState(key: string, columnState: ColumnState[]): void {
    this.localStorage.setItem(key, JSON.stringify(columnState));
  }
}
