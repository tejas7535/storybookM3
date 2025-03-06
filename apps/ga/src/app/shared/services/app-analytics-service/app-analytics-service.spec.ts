import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { EmbeddedGoogleAnalyticsService } from '../embedded-google-analytics';
import { MobileFirebaseAnalyticsService } from '../mobile-firebase-analytics/mobile-firebase-analytics.service';
import { AppAnalyticsService } from './app-analytics-service';
import { InteractionEventType } from './interaction-event-type.enum';

describe('AppAnalyticsService', () => {
  let spectator: SpectatorService<AppAnalyticsService>;
  let service: AppAnalyticsService;
  let googleAnalyticsService: EmbeddedGoogleAnalyticsService;
  let firebaseAnalyticsService: MobileFirebaseAnalyticsService;

  const createService = createServiceFactory({
    service: AppAnalyticsService,
    mocks: [EmbeddedGoogleAnalyticsService, MobileFirebaseAnalyticsService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(AppAnalyticsService);
    googleAnalyticsService = spectator.inject(EmbeddedGoogleAnalyticsService);
    firebaseAnalyticsService = spectator.inject(MobileFirebaseAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when check if log events should be performed', () => {
    describe('when all delegated services should not log any events', () => {
      beforeEach(() => {
        googleAnalyticsService.isApplicationOfEmbeddedVersion = jest.fn(
          () => false
        );
        firebaseAnalyticsService.isMobilePlatform = jest.fn(() => false);
      });

      it('should not log events', () => {
        expect(service.shouldLogEvents()).toBe(false);
      });
    });

    describe('when is type of embedded application', () => {
      beforeEach(() => {
        googleAnalyticsService.isApplicationOfEmbeddedVersion = jest.fn(
          () => true
        );
        firebaseAnalyticsService.isMobilePlatform = jest.fn(() => false);
      });

      it('should log events', () => {
        expect(service.shouldLogEvents()).toBe(true);
      });
    });

    describe('when is type of mobile application', () => {
      beforeEach(() => {
        googleAnalyticsService.isApplicationOfEmbeddedVersion = jest.fn(
          () => false
        );
        firebaseAnalyticsService.isMobilePlatform = jest.fn(() => true);
      });

      it('should log events', () => {
        expect(service.shouldLogEvents()).toBe(true);
      });
    });
  });

  describe('when navigtion event is logged', () => {
    const url = 'navigationUrl';
    beforeEach(() => {
      service.logNavigationEvent(url);
    });
    it('should delegate navigation log event to services', () => {
      expect(googleAnalyticsService.logNavigationEvent).toHaveBeenCalledWith(
        url
      );
      expect(firebaseAnalyticsService.logNavigationEvent).toHaveBeenCalledWith(
        url
      );
    });
  });

  describe('when interaction event is logged', () => {
    const event = InteractionEventType.ShowAllValues;

    beforeEach(() => {
      service.logInteractionEvent(event);
    });

    it('should delegate interaction log event to services', () => {
      expect(googleAnalyticsService.logInteractionEvent).toHaveBeenCalledWith(
        event
      );
      expect(firebaseAnalyticsService.logInteractionEvent).toHaveBeenCalledWith(
        event
      );
    });
  });

  describe('when raw interaction event is logged', () => {
    beforeEach(() => {
      googleAnalyticsService.createInteractionEvent = jest.fn(
        (action, action_formatted) => ({
          event: 'grease_app_interaction',
          raw_action: 'click',
          raw_action_formatted: 'Click',
          action,
          action_formatted,
        })
      );

      service.logRawInteractionEvent('some_action', 'Some action Formatted');
    });

    it('should delegate raw interaction log event to services', () => {
      expect(googleAnalyticsService.logEvent).toHaveBeenCalledWith({
        event: 'grease_app_interaction',
        raw_action: 'click',
        raw_action_formatted: 'Click',
        action: 'some_action',
        action_formatted: 'Some action Formatted',
      });
      expect(
        firebaseAnalyticsService.logRawInteractionEvent
      ).toHaveBeenCalledWith('some_action', 'Some action Formatted');
    });
  });

  describe('when open external link event is logged', () => {
    const name = 'some product';

    beforeEach(() => {
      service.logOpenExternalLinkEvent(name);
    });

    it('should delegate open external link event to services', () => {
      expect(
        googleAnalyticsService.logOpenExternalLinkEvent
      ).toHaveBeenCalledWith(name);
      expect(
        firebaseAnalyticsService.logOpenExternalLinkEvent
      ).toHaveBeenCalledWith(name);
    });
  });
});
