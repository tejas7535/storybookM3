import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

@Injectable({
  providedIn: 'root',
})
export class MobileKeyboardVisibilityService implements OnDestroy {
  private readonly isKeyboardVisibleSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly isKeyboardVisible$ =
    this.isKeyboardVisibleSubject.asObservable();

  constructor() {
    if (Capacitor.isNativePlatform()) {
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardVisibleSubject.next(true);
      });

      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardVisibleSubject.next(false);
      });
    }
  }

  async ngOnDestroy(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      Keyboard.removeAllListeners();
    }
  }
}
