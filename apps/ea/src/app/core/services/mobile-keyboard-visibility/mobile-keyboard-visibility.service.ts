/* eslint-disable @typescript-eslint/member-ordering */
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

  private readonly initialViewportHeight: number;

  public readonly isKeyboardVisible$ =
    this.isKeyboardVisibleSubject.asObservable();

  constructor() {
    if (Capacitor.isNativePlatform()) {
      Keyboard.setAccessoryBarVisible({ isVisible: true });

      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardVisibleSubject.next(true);
      });

      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardVisibleSubject.next(false);
      });
    }

    if (this.checkIfMobileWeb()) {
      this.initialViewportHeight = window.innerHeight;
      this.setupWebListeners();
    }
  }

  async ngOnDestroy(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      Keyboard.removeAllListeners();
    }

    if (this.checkIfMobileWeb()) {
      window.visualViewport.removeEventListener('resize', this.handleResize);
    }
  }

  private checkIfMobileWeb(): boolean {
    // replace with https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API once it will be ouf of experimental

    return /iphone|android/i.test(navigator.userAgent);
  }

  private setupWebListeners(): void {
    window.visualViewport.addEventListener('resize', this.handleResize);
  }

  private readonly handleResize = (event: any) => {
    const viewport = event.target as VisualViewport;
    const currentHeight = viewport.height;
    const isKeyboardVisible = currentHeight < this.initialViewportHeight;

    this.isKeyboardVisibleSubject.next(isKeyboardVisible);
  };
}
