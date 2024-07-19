import {
  createServiceFactory,
  SpectatorService,
  SpectatorServiceFactory,
} from '@ngneat/spectator/jest';

import { EnvironmentEnum } from '../../models';
import { FeatureToggleConfigService } from './feature-toggle-config.service';
import { FEATURE_TOGGLE_DEFAULT_CONFIG } from './feature-toggle-default-config.injection-token';

describe('FeatureToggleConfigService', () => {
  let service: FeatureToggleConfigService;
  let spectator: SpectatorService<FeatureToggleConfigService>;
  let createService: SpectatorServiceFactory<FeatureToggleConfigService>;
  const DEFAULT_CONFIG = { feat1: true, feat2: false };

  describe('with default config', () => {
    createService = createServiceFactory({
      service: FeatureToggleConfigService,
      providers: [
        {
          provide: FEATURE_TOGGLE_DEFAULT_CONFIG,
          useValue: DEFAULT_CONFIG,
        },
      ],
    });

    beforeEach(() => {
      spectator = createService();
      service = spectator.service;
    });
    describe('initializeLocalstorage', () => {
      test('on Prod system should delete existing localstorage', () => {
        localStorage.setItem('config', JSON.stringify(DEFAULT_CONFIG));
        service.initializeLocalStorage(EnvironmentEnum.prod);
        expect(localStorage.getItem('config')).toBeUndefined();
      });

      test('on PreProd system should delete existing localstorage', () => {
        localStorage.setItem('config', JSON.stringify(DEFAULT_CONFIG));
        service.initializeLocalStorage(EnvironmentEnum['pre-release']);
        expect(localStorage.getItem('config')).toBeUndefined();
      });

      test('should return default config', () => {
        localStorage.setItem(
          'config',
          JSON.stringify({ feat1: false, feat2: true })
        );
        service.initializeLocalStorage(EnvironmentEnum.prod);
        expect(service.Config).toEqual(DEFAULT_CONFIG);
        expect(localStorage.getItem('config')).toBeUndefined();
        expect(service.isProduction).toBe(true);
      });

      test('Should set the config to local Storage', () => {
        localStorage.removeItem('config');
        service.initializeLocalStorage(EnvironmentEnum.dev);
        expect(localStorage.getItem('config')).toEqual(
          JSON.stringify(DEFAULT_CONFIG)
        );
      });
    });

    describe('saveConfigToLocalStorage', () => {
      it('should update configuration', () => {
        service.initializeLocalStorage(EnvironmentEnum.dev);
        localStorage.setItem('config', JSON.stringify(DEFAULT_CONFIG));
        const changedConfig = { feat1: false, feat2: true };
        service.saveConfigToLocalStorage(changedConfig);
        expect(JSON.parse(localStorage.getItem('config'))).toEqual(
          changedConfig
        );
        expect(service.Config).toBe(changedConfig);
      });

      it('should not update on productive environment', () => {
        service.initializeLocalStorage(EnvironmentEnum.prod);
        const changedConfig = { feat1: false, feat2: true };
        service.saveConfigToLocalStorage(JSON.stringify(changedConfig));
        expect(localStorage.getItem('config')).toBeUndefined();
        expect(service.Config).toBe(DEFAULT_CONFIG);
      });
    });

    describe('IsEnabled', () => {
      test('should return value for requested feature', () => {
        service.initializeLocalStorage(EnvironmentEnum.dev);
        expect(service.isEnabled('feat1')).toBe(true);
      });
    });
  });

  describe('cumulated config', () => {
    createService = createServiceFactory({
      service: FeatureToggleConfigService,
      providers: [
        {
          provide: FEATURE_TOGGLE_DEFAULT_CONFIG,
          useValue: { ...DEFAULT_CONFIG, feat4: false },
        },
      ],
    });

    beforeEach(() => {
      spectator = createService();
      service = spectator.service;
    });
    test('should remove outdated fields and add new fields', () => {
      // shall remove feat3 from storage, add feat4, because config had changed
      const config = { ...DEFAULT_CONFIG, feat3: true };
      localStorage.setItem('config', JSON.stringify(config));
      service.initializeLocalStorage(EnvironmentEnum.dev);
      expect(localStorage.getItem('config')).toBe(
        JSON.stringify({ ...DEFAULT_CONFIG, feat4: false })
      );
    });
  });

  describe('default configuration ["*": true] provided', () => {
    createService = createServiceFactory({
      service: FeatureToggleConfigService,
      providers: [
        {
          provide: FEATURE_TOGGLE_DEFAULT_CONFIG,
          useValue: { '*': true },
        },
      ],
    });

    beforeEach(() => {
      spectator = createService();
      service = spectator.service;
    });

    test('should return true no matter which name', () => {
      expect(service.isEnabled('anyName')).toBe(true);
    });
  });
});
