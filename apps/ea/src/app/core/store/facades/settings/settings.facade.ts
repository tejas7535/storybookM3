import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';

import {
  isResultPreviewSticky,
  isStandalone,
} from '../../selectors/settings/settings.selector';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {
  public readonly isStandalone$ = this.store.select(isStandalone);
  public readonly isResultPreviewSticky$ = this.store.select(
    isResultPreviewSticky
  );

  constructor(private readonly store: Store) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
