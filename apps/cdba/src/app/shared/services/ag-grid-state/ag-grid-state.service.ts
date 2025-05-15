import { Injectable } from '@angular/core';

import { ColumnState } from 'ag-grid-enterprise';

import { LocalStorageService } from '../local-storage/local-storage.service';

interface AgGridState {
  columnState: ColumnState[];
}

@Injectable({
  providedIn: 'root',
})
export class AgGridStateService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  public getColumnState(key: string): ColumnState[] {
    return this.localStorageService.getItem<AgGridState>(key, true)
      ?.columnState;
  }

  public setColumnState(key: string, columnState: ColumnState[]): void {
    const state: AgGridState = this.localStorageService.getItem(key, true);

    if (state) {
      this.localStorageService.setItem<AgGridState>(
        key,
        {
          ...state,
          columnState,
        },
        true
      );
    } else {
      this.localStorageService.setItem<AgGridState>(key, { columnState }, true);
    }
  }
}
