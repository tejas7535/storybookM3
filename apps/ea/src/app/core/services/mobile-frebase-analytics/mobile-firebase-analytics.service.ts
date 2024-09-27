import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { BasicEvent } from '../google-analytics';

@Injectable({
  providedIn: 'root',
})
export class MobileFirebaseAnalyticsService {
  public logEvent<T extends BasicEvent>(event: T): void {
    if (this.isMobilePlatform()) {
      FirebaseAnalytics.logEvent({
        name: this.formatAction(event.action),
        params: {
          ...event,
        },
      });
    }
  }

  private isMobilePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  private formatAction(action: string): string {
    return action.toLowerCase().replaceAll(/\s+/g, '_');
  }
}
