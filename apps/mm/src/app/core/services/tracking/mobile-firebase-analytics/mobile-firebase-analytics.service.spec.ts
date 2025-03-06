/* eslint-disable import/no-extraneous-dependencies */
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
    service = spectator.inject(MobileFirebaseAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when app is delivered as mobile platform', () => {
    beforeAll(() => {
      isNativePlatformMock.mockReturnValue(true);
    });

    afterEach(() => {
      logEventSpy.mockReset();
    });

    describe('when logOpenExternalLinkEvent is called', () => {
      beforeEach(() => {
        service.logOpenExternalLinkEvent('some product name');
      });

      it('should log event about clicking external link', () => {
        expect(logEventSpy).toHaveBeenCalledWith({
          name: 'access_product_details',
          params: {
            content_type: 'externalLinkNavigation',
            content_id: 'Access Product Details',
            items: [{ name: 'some product name' }],
          },
        });
      });
    });
  });

  describe('when app is not delivered as mobile', () => {
    beforeAll(() => {
      isNativePlatformMock.mockReturnValue(false);
    });

    describe('when all possible logging calls are made', () => {
      beforeEach(() => {
        service.logOpenExternalLinkEvent('some product name');
      });

      it('should not log any events', () => {
        expect(logEventSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('when isMobilePlatform called', () => {
    describe('when app is delivered as mobile', () => {
      beforeAll(() => {
        isNativePlatformMock.mockReturnValue(true);
      });

      it('should qualify app as mobile', () => {
        expect(service.isMobilePlatform()).toBe(true);
      });
    });
  });
});
