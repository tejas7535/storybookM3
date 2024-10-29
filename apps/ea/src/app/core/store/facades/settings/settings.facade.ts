import { Injectable } from '@angular/core';

import { combineLatest, map } from 'rxjs';

import { Capacitor } from '@capacitor/core';
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

  public readonly isNativeMobile = Capacitor.isNativePlatform();

  public readonly isMobileKeyboardVisible$ = combineLatest([
    this.isStandalone$,
    this.mobileKeyboardVisibilityService.isKeyboardVisible$,
  ]).pipe(
    map(([isStandaloneApp, isKeyboardVisible]) =>
      isStandaloneApp ? isKeyboardVisible : false
    )
  );

  constructor(
    private readonly store: Store,
    private readonly mobileKeyboardVisibilityService: MobileKeyboardVisibilityService
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
