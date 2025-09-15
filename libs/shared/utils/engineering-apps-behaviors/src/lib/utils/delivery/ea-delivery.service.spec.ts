import { Provider } from '@angular/core';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { EaDeliveryService } from './ea-delivery.service';
import { DEFAULT_ASSETS_PATH, EA_CAPACITOR } from './ea-delivery.token';

describe('EaDeliveryService', () => {
  let service: EaDeliveryService;
  let spectator: SpectatorService<EaDeliveryService>;

  const createService = createServiceFactory({
    service: EaDeliveryService,
    providers: [
      {
        provide: DEFAULT_ASSETS_PATH,
        useValue: 'somewhere/assets',
      },
      {
        provide: EA_CAPACITOR,
        useValue: {
          isNativePlatform: jest.fn(() => false),
          getPlatform: jest.fn(() => 'ios'),
        },
      },
    ],
  });

  const setup = (providers?: Provider[] | undefined) =>
    beforeEach(() => {
      spectator = createService({ providers });
      service = spectator.service;
    });

  describe('not mobile', () => {
    setup();

    it('should return false if not on a mobile platform', () => {
      expect(service.isMobile()).toBe(false);
    });

    it('should return undefined if not on a mobile platform', () => {
      expect(service.platform()).toBeUndefined();
    });

    it('should return the default assets path if not on a mobile platform', () => {
      expect(service.assetsPath()).toBe('somewhere/assets');
    });
  });

  describe('with ios', () => {
    setup([
      {
        provide: DEFAULT_ASSETS_PATH,
        useValue: 'somewhere/assets',
      },
      {
        provide: EA_CAPACITOR,
        useValue: {
          isNativePlatform: jest.fn(() => true),
          getPlatform: jest.fn(() => 'ios'),
        },
      },
    ]);

    it('should return ios if on ios platform', () => {
      expect(service.platform()).toBe('ios');
    });

    it('should return the ios assets path if on ios platform', () => {
      expect(service.assetsPath()).toBe('capacitor://localhost/assets');
    });
  });

  describe('with android', () => {
    setup([
      {
        provide: DEFAULT_ASSETS_PATH,
        useValue: '/assets',
      },
      {
        provide: EA_CAPACITOR,
        useValue: {
          isNativePlatform: jest.fn(() => true),
          getPlatform: jest.fn(() => 'android'),
        },
      },
    ]);

    it('should return ios if on android platform', () => {
      expect(service.platform()).toBe('android');
    });

    it('should return the android assets path if on android platform', () => {
      expect(service.assetsPath()).toBe('https://localhost/assets');
    });
  });
});
