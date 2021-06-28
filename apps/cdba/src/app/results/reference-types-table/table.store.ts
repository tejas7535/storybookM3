import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ComponentStore } from '@ngrx/component-store';

interface TableState {
  filters: any;
}

@Injectable()
export class TableStore extends ComponentStore<TableState> {
  public constructor() {
    super({ filters: undefined });
  }

  public readonly filters$: Observable<any> = this.select(
    (state) => state.filters
  );

  public readonly setFilters = this.updater((state, filters: any) => ({
    ...state,
    filters,
  }));
}
