import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { getBearingDesignation } from '../../selectors/settings/settings.selector';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {
  bearingDesignation$ = this.store.select(getBearingDesignation);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
