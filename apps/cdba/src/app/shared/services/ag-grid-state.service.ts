import { Inject, Injectable } from '@angular/core';

import { ColumnState } from '@ag-grid-enterprise/all-modules';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

interface AgGridState {
  columnState: ColumnState[];
}

@Injectable({
  providedIn: 'root',
})
export class AgGridStateService {
  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  public getColumnState(key: string): ColumnState[] {
    return JSON.parse(this.localStorage.getItem(key))?.columnState;
  }

  public setColumnState(key: string, columnState: ColumnState[]): void {
    const state: AgGridState = JSON.parse(this.localStorage.getItem(key));

    if (state) {
      this.localStorage.setItem(key, JSON.stringify({ ...state, columnState }));
    } else {
      this.localStorage.setItem(key, JSON.stringify({ columnState }));
    }
  }
}
