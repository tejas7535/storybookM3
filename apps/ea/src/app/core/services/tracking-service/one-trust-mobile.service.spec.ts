/* eslint-disable import/no-extraneous-dependencies */
import { waitForAsync } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { Capacitor } from '@capacitor/core';
import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AdvertisingIdService } from './advertising-id.service';
import { IdfaStatus, OneTrustInterface } from './one-trust.interface';
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
  let advertisingIdServiceMock: AdvertisingIdService;
  const startSDKMock = jest.fn();
  const shouldShowBannerMock = jest.fn();
  const showBannerMock = jest.fn();
  const observeChangesMock = jest.fn();
  const showPreferenceCenterUIMock = jest.fn();
  const showConsentUIMock = jest.fn();
  const langChanges$ = new BehaviorSubject<string>('en');
  const langChangesObservable$ = langChanges$.asObservable();

  delete window.OneTrust;
  window.OneTrust = {
    devicePermission: {
      idfa: 'device_idfa',
    },
    startSDK: startSDKMock,
    shouldShowBanner: shouldShowBannerMock,
    showBannerUI: showBannerMock,
    observeChanges: observeChangesMock,
    showPreferenceCenterUI: showPreferenceCenterUIMock,
    showConsentUI: showConsentUIMock,
  };

  const createService = createServiceFactory({
    service: OneTrustMobileService,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          getActiveLang: getActiveLangMock,
          langChanges$: langChangesObservable$,
        },
      },
      {
        provide: AdvertisingIdService,
        useValue: {
          initializeStatusObservable: jest.fn(),
          getAddStatus: jest.fn(),
          authorized: 'Authorized',
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(OneTrustMobileService);
    advertisingIdServiceMock = spectator.inject(AdvertisingIdService);
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
      showConsentUIMock.mockResolvedValue(true);
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

      it('should intialize the advertising id status observable', () => {
        expect(
          advertisingIdServiceMock.initializeStatusObservable
        ).toHaveBeenCalled();
      });

      it('should show the consent ui', () => {
        expect(showConsentUIMock).toHaveBeenCalledWith(
          'device_idfa',
          expect.any(Function)
        );
      });

      describe('when the consent ui is shown', () => {
        describe('when the consent is authorized', () => {
          beforeAll(() => {
            const consentCallback = showConsentUIMock.mock.calls[0][1];
            consentCallback(IdfaStatus.Authorized);
          });

          it('should show the banner', () => {
            expect(shouldShowBannerMock).toHaveBeenCalled();
          });

          it('should not subscirbe to the advertising id status observable', () => {
            expect(
              advertisingIdServiceMock.getAddStatus
            ).not.toHaveBeenCalled();
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

        describe('when the consent is not determined', () => {
          const addStatus: BehaviorSubject<string> =
            new BehaviorSubject<string>('Not Determined');

          beforeAll(() => {
            (
              advertisingIdServiceMock.getAddStatus as jest.Mock
            ).mockReturnValue(addStatus.asObservable());

            const consentCallback = showConsentUIMock.mock.calls[0][1];
            consentCallback(IdfaStatus.NotDetermined);
            shouldShowBannerMock.mockReset();
          });

          it('should not show the banner', () => {
            expect(shouldShowBannerMock).not.toHaveBeenCalled();
          });

          it('should subscirbe to the advertising id status observable', () => {
            expect(advertisingIdServiceMock.getAddStatus).toHaveBeenCalled();
          });

          describe('when the advertising id status changes', () => {
            beforeAll(() => {
              addStatus.next('Authorized');
            });

            it('should show the banner', () => {
              expect(shouldShowBannerMock).toHaveBeenCalled();
            });

            it('should show the banner ui', () => {
              expect(showBannerMock).toHaveBeenCalled();
            });
          });
        });
      });
    });
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
