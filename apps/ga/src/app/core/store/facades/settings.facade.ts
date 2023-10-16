import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  getAppDelivery,
  getAppIsEmbedded,
  getPartnerVersion,
} from '../selectors/settings/settings.selector';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {
  appDelivery$ = this.store.select(getAppDelivery);
  appIsEmbedded$ = this.store.select(getAppIsEmbedded);
  partnerVersion$ = this.store.select(getPartnerVersion);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
