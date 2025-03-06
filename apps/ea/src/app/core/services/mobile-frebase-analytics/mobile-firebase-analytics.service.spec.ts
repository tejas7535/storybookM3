import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { MobileFirebaseAnalyticsService } from './mobile-firebase-analytics.service';

const isNativePlatformMock = jest.fn();
Capacitor.isNativePlatform = isNativePlatformMock;

jest.mock('@capacitor-community/firebase-analytics', () => ({
  FirebaseAnalytics: {
    logEvent: jest.fn(),
  },
}));

const logEventSpy = jest.spyOn(FirebaseAnalytics, 'logEvent');

describe('MobileFirebaseAnalyticsService', () => {
  let spectator: SpectatorService<MobileFirebaseAnalyticsService>;
  let service: MobileFirebaseAnalyticsService;

  const createService = createServiceFactory({
    service: MobileFirebaseAnalyticsService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logEvent', () => {
    describe('when app is delivered as mobile platform', () => {
      beforeAll(() => {
        isNativePlatformMock.mockReturnValue(true);
      });

      afterEach(() => {
        logEventSpy.mockReset();
      });
      it('should call logEvent with the correct event name and params', () => {
        const event = {
          action: 'Test Action',
          testParam: 'Test Param',
        };

        service.logEvent(event);

        expect(logEventSpy).toHaveBeenCalledWith({
          name: 'test_action',
          params: {
            ...event,
          },
        });
      });
    });

    describe('when app is not delivered as mobile platform', () => {
      beforeAll(() => {
        isNativePlatformMock.mockReturnValue(false);
      });

      it('should not call logEvent', () => {
        const event = {
          action: 'Test Action',
          testParam: 'Test Param',
        };

        service.logEvent(event);

        expect(logEventSpy).not.toHaveBeenCalled();
      });
    });
  });
});
