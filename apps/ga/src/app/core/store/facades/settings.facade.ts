import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  getAppDelivery,
  getAppIsEmbedded,
} from '../selectors/settings/settings.selector';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {
  appDelivery$ = this.store.select(getAppDelivery);
  appIsEmbedded$ = this.store.select(getAppIsEmbedded);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
