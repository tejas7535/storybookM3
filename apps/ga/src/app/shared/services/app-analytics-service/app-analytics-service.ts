import { Injectable } from '@angular/core';

import { EmbeddedGoogleAnalyticsService } from '../embedded-google-analytics';
import { MobileFirebaseAnalyticsService } from '../mobile-firebase-analytics/mobile-firebase-analytics.service';
import { InteractionEventType } from './interaction-event-type.enum';

@Injectable({
  providedIn: 'root',
})
export class AppAnalyticsService {
  constructor(
    private readonly embeddedGoogleAnalyticsService: EmbeddedGoogleAnalyticsService,
    private readonly mobileFirebaseTrackingService: MobileFirebaseAnalyticsService
  ) {}

  public shouldLogEvents(): boolean {
    return (
      this.mobileFirebaseTrackingService.isMobilePlatform() ||
      this.embeddedGoogleAnalyticsService.isApplicationOfEmbeddedVersion()
    );
  }

  public logNavigationEvent(navigationUrl: string): void {
    this.mobileFirebaseTrackingService.logNavigationEvent(navigationUrl);
    this.embeddedGoogleAnalyticsService.logNavigationEvent(navigationUrl);
  }

  public logInteractionEvent(eventType: InteractionEventType): void {
    this.mobileFirebaseTrackingService.logInteractionEvent(eventType);
    this.embeddedGoogleAnalyticsService.logInteractionEvent(eventType);
  }

  public logRawInteractionEvent(action: string, actionFormatted: string): void {
    this.embeddedGoogleAnalyticsService.logEvent(
      this.embeddedGoogleAnalyticsService.createInteractionEvent(
        action,
        actionFormatted
      )
    );
    this.mobileFirebaseTrackingService.logRawInteractionEvent(
      action,
      actionFormatted
    );
  }

  public logOpenExternalLinkEvent(productName: string): void {
    this.mobileFirebaseTrackingService.logOpenExternalLinkEvent(productName);
    this.embeddedGoogleAnalyticsService.logOpenExternalLinkEvent(productName);
  }
}
