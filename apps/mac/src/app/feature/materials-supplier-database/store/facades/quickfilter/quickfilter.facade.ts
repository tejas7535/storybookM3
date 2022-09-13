import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { getQuickFilter } from '@mac/msd/store';

@Injectable({
  providedIn: 'root',
})
export class QuickFilterFacade {
  quickFilter$ = this.store.select(getQuickFilter);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
