/* eslint-disable import/no-extraneous-dependencies */
import { inject, Injectable } from '@angular/core';

import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { EaDeliveryService } from '@schaeffler/engineering-apps-behaviors/utils';

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
  private readonly deliveryService = inject(EaDeliveryService);

  public readonly isMobile = this.deliveryService.isMobile;

  public logOpenExternalLinkEvent(productName: string) {
    if (!this.isMobile()) {
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

  private logEvent(event: InteractionEvent): void {
    if (!event) {
      return;
    }

    FirebaseAnalytics.logEvent(event);
  }
}
