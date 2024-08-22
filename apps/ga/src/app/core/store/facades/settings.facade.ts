import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  getAppDelivery,
  getAppIsEmbedded,
  getInternalUser,
  getPartnerVersion,
  shouldShowGreaseRecommendation,
} from '../selectors/settings/settings.selector';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {
  appDelivery$ = this.store.select(getAppDelivery);
  appIsEmbedded$ = this.store.select(getAppIsEmbedded);
  partnerVersion$ = this.store.select(getPartnerVersion);
  internalUser$ = this.store.select(getInternalUser);
  showGreaseRecommendation$ = this.store.select(shouldShowGreaseRecommendation);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
