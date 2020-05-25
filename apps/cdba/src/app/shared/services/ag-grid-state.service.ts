import { Injectable } from '@angular/core';

import { ColumnState } from '../../search/reference-types-table/column-state';
import { SortState } from '../../search/reference-types-table/sort-state';

interface AgGridState {
  sort: SortState[];
  columns: ColumnState[];
}

@Injectable({
  providedIn: 'root',
})
export class AgGridStateService {
  public getColumnState(key: string): ColumnState[] {
    return JSON.parse(localStorage.getItem(key))?.columns;
  }

  public setColumnState(key: string, columns: ColumnState[]): void {
    const state: AgGridState = JSON.parse(localStorage.getItem(key));

    if (state) {
      localStorage.setItem(key, JSON.stringify({ ...state, columns }));
    } else {
      localStorage.setItem(key, JSON.stringify({ columns }));
    }
  }

  public getSortState(key: string): SortState[] {
    return JSON.parse(localStorage.getItem(key))?.sort;
  }

  public setSortState(key: string, sort: SortState[]): void {
    const state: AgGridState = JSON.parse(localStorage.getItem(key));

    if (state) {
      localStorage.setItem(key, JSON.stringify({ ...state, sort }));
    } else {
      localStorage.setItem(key, JSON.stringify({ sort }));
    }
  }
}
