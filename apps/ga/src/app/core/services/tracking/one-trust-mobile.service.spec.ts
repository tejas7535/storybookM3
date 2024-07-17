/* eslint-disable import/no-extraneous-dependencies */
import { waitForAsync } from '@angular/core/testing';

import { Capacitor } from '@capacitor/core';
import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { OneTrustInterface } from './one-trust.interface';
import { OneTrustMobileService } from './one-trust-mobile.service';
const getActiveLangMock = jest.fn().mockReturnValue('pl');

const isNativePlatformMock = jest.fn();
Capacitor.isNativePlatform = isNativePlatformMock;

const platformMock = jest.fn();
Capacitor.getPlatform = platformMock;

declare const window: Window &
  typeof globalThis & {
    OneTrust: OneTrustInterface;
  };

describe('OneTrustMobileService', () => {
  let spectator: SpectatorService<OneTrustMobileService>;
  let service: OneTrustMobileService;
  const startSDKMock = jest.fn();
  const shouldShowBannerMock = jest.fn();
  const showBannerMock = jest.fn();
  const observeChangesMock = jest.fn();
  const showPreferenceCenterUIMock = jest.fn();

  delete window.OneTrust;
  window.OneTrust = {
    startSDK: startSDKMock,
    shouldShowBanner: shouldShowBannerMock,
    showBannerUI: showBannerMock,
    observeChanges: observeChangesMock,
    showPreferenceCenterUI: showPreferenceCenterUIMock,
  };

  const createService = createServiceFactory({
    service: OneTrustMobileService,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          getActiveLang: getActiveLangMock,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(OneTrustMobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when tracking is initialized on non mobile platform', () => {
    beforeAll(() => {
      startSDKMock.mockReset();
      isNativePlatformMock.mockReturnValue(false);

      service.initTracking();
    });

    it('should not start tracking sdk', () => {
      expect(startSDKMock).not.toHaveBeenCalled();
    });
  });

  describe('when tracking is initialized on mobile platform', () => {
    beforeAll(() => {
      platformMock.mockReturnValue('android');
      isNativePlatformMock.mockReturnValue(true);
      startSDKMock.mockReturnValue(true);
      shouldShowBannerMock.mockResolvedValue(true);
      service.initTracking();
    });

    it('should start one trust mobile sdk', waitForAsync(() => {
      expect(startSDKMock).toHaveBeenCalled();
    }));

    describe('when the success callback is called', () => {
      beforeAll(() => {
        const successCallback = startSDKMock.mock.calls[0][4];
        successCallback('status');
      });

      it('should show the banner', () => {
        expect(shouldShowBannerMock).toHaveBeenCalled();
      });

      describe('when the banner should be shown', () => {
        beforeAll(() => {
          const shouldShowCallback = shouldShowBannerMock.mock.calls[0][0];
          shouldShowCallback(true);
        });

        it('should show the banner ui', () => {
          expect(showBannerMock).toHaveBeenCalled();
        });
      });
    });

    describe('when the error callback is called', () => {
      beforeAll(() => {
        shouldShowBannerMock.mockReset();
        const errorCallback = startSDKMock.mock.calls[0][5];
        errorCallback('error');
      });

      it('should not show the banner', () => {
        expect(shouldShowBannerMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when tracking is initialized on ios', () => {
    beforeAll(() => {
      platformMock.mockReturnValue('ios');
      isNativePlatformMock.mockReturnValue(true);
      startSDKMock.mockReturnValue(true);
      shouldShowBannerMock.mockResolvedValue(true);
      service.initTracking();
    });

    it('should start one trust mobile sdk', waitForAsync(() => {
      expect(startSDKMock).toHaveBeenCalled();
    }));
  });

  describe('showPreferenceCenterUI', () => {
    beforeAll(() => {
      service.showPreferenceCenterUI();
    });

    it('should show the preference center ui', () => {
      expect(showPreferenceCenterUIMock).toHaveBeenCalled();
    });
  });
});
