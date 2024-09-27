import { Injectable } from '@angular/core';

import { MobileKeyboardVisibilityService } from '@ea/core/services/mobile-keyboard-visibility/mobile-keyboard-visibility.service';
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

  public readonly isMobileKeyboardVisible$ =
    this.mobileKeyboardVisibilityService.isKeyboardVisible$;

  constructor(
    private readonly store: Store,
    private readonly mobileKeyboardVisibilityService: MobileKeyboardVisibilityService
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
