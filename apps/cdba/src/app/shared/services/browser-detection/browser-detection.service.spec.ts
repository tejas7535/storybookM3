import { Platform } from '@angular/cdk/platform';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BrowserDetectionService } from './browser-detection.service';

describe('BrowserDetectionService', () => {
  let spectator: SpectatorService<BrowserDetectionService>;
  let service: BrowserDetectionService;
  let mockedPlatform: Platform;

  const createService = createServiceFactory({
    service: BrowserDetectionService,
    mocks: [Platform],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(BrowserDetectionService);
    mockedPlatform = spectator.inject(Platform);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isUnsupportedBrowser', () => {
    it('should detect others than Chrome or Edge as not supported browser', () => {
      mockedPlatform.BLINK = false;
      mockedPlatform.TRIDENT = true;

      expect(service.isUnsupportedBrowser()).toBeTruthy();
    });

    it('should detect Firefox as not supported browser', () => {
      mockedPlatform.BLINK = false;
      mockedPlatform.FIREFOX = true;

      expect(service.isUnsupportedBrowser()).toBeTruthy();
    });

    it('should detect browsers based on the Blink rendering engine as supported browsers', () => {
      mockedPlatform.BLINK = true;

      expect(service.isUnsupportedBrowser()).toBeFalsy();
    });
  });
});
