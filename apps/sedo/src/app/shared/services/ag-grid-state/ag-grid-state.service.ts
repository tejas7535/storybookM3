import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { ColumnState } from 'ag-grid-enterprise';

@Injectable({
  providedIn: 'root',
})
export class AgGridStateService {
  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  public getColumnState(key: string): ColumnState[] {
    return JSON.parse(this.localStorage.getItem(`${key}-column-config`));
  }

  public setColumnState(key: string, columnState: ColumnState[]): void {
    this.localStorage.setItem(
      `${key}-column-config`,
      JSON.stringify(columnState)
    );
  }
}
