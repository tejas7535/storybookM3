import { Injectable } from '@angular/core';

import { ColumnState } from '@ag-grid-enterprise/all-modules';

interface AgGridState {
  columnState: ColumnState[];
}

@Injectable({
  providedIn: 'root',
})
export class AgGridStateService {
  public getColumnState(key: string): ColumnState[] {
    return JSON.parse(localStorage.getItem(key))?.columnState;
  }

  public setColumnState(key: string, columnState: ColumnState[]): void {
    const state: AgGridState = JSON.parse(localStorage.getItem(key));

    if (state) {
      localStorage.setItem(key, JSON.stringify({ ...state, columnState }));
    } else {
      localStorage.setItem(key, JSON.stringify({ columnState }));
    }
  }
}
