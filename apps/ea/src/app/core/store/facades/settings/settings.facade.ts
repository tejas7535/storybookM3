import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import { isStandalone } from '../../selectors/settings/settings.selector';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {
  public readonly isStandalone$ = this.store.select(isStandalone);

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
