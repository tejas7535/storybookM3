/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

interface InteractionEvent {
  name: string;
  params: {
    content_type: string;
    content_id: string;
  };
}

enum InteractionType {
  ExternalLink = 'externalLinkNavigation',
}

@Injectable({
  providedIn: 'root',
})
export class MobileFirebaseAnalyticsService {
  public logOpenExternalLinkEvent(productName: string) {
    if (!this.isMobilePlatform()) {
      return;
    }

    const externalLinkEvent = {
      name: 'access_product_details',
      params: {
        content_type: InteractionType.ExternalLink,
        content_id: 'Access Product Details',
        items: [{ name: productName }],
      },
    };

    this.logEvent(externalLinkEvent);
  }

  public isMobilePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  private logEvent(event: InteractionEvent): void {
    if (!event) {
      return;
    }

    FirebaseAnalytics.logEvent(event);
  }
}
